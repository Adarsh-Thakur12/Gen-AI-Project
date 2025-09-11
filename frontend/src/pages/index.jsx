import React, { useState } from "react";
import { generateArtisanBio, generateProductContent } from "../api/generation";

const CGPage = () => {
    // State to manage which form is currently displayed: 'bio' or 'content'
    const [feature, setFeature] = useState('bio');

    // State for all form inputs, using a single object for unified management
    const [formData, setFormData] = useState({
        bio: {
            artisanName: '',
            location: '',
            craftSpecialization: '',
            personalStory: ''
        },
        content: {
            productName: '',
            keyMaterials: '',
            artisanNotes: ''
        }
    });

    // State for generated text
    const [generatedBio, setGeneratedBio] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');

    // Handle all form input changes with a single handler
    const handleChange = (e, formType) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [formType]: {
                ...prevData[formType],
                [name]: value
            }
        }));
    };

    // Handle form submissions
    const handleBioSubmit = async (e) => {
        e.preventDefault();
        try {
            const newBio = await generateArtisanBio({
            artisan_name: formData.bio.artisanName,
            location: formData.bio.location,
            craft_specialization: formData.bio.craftSpecialization,
            personal_story: formData.bio.personalStory
            });
            setGeneratedBio(newBio.artisan_bio || "No bio generated.");
        } catch (error) {
            console.error("Error generating bio:", error);
            setGeneratedBio("Failed to generate bio.");
        }
    };

    const handleContentSubmit = async (e) => {
        e.preventDefault();
        try {
            const newContent = await generateProductContent({
            product_name: formData.content.productName,
            materials: formData.content.keyMaterials,
            artisan_notes: formData.content.artisanNotes
            });

            // Format the response into a readable string or display individual fields
            const formatted = `
            🛍️ Title: ${newContent.product_title}
            
            📖 Description:
            ${newContent.product_description}
            
            📸 Instagram Post:
            ${newContent.instagram_post}
            
            🔖 Hashtags:
            ${newContent.hashtags}
            
            📲 WhatsApp Message:
            ${newContent.whatsapp_message}
            
            🔍 SEO Tags:
            ${newContent.seo_tags}
            `;
            setGeneratedContent(formatted);
        } catch (error) {
            console.error("Error generating content:", error);
            setGeneratedContent("Failed to generate content.");
        }
    };

    // Function to render the appropriate form based on the 'feature' state
    const renderForm = () => {
        if (feature === 'bio') {
            return (
                <form onSubmit={handleBioSubmit} style={formContainerStyle}>
                    <label style={labelStyle}>
                        <span style={spanStyle}>Artisan's Name</span>
                        <input
                            type="text"
                            name="artisanName"
                            value={formData.bio.artisanName}
                            onChange={(e) => handleChange(e, 'bio')}
                            style={inputStyle}
                        />
                    </label>

                    <label style={labelStyle}>
                        <span style={spanStyle}>Location</span>
                        <input
                            type="text"
                            name="location"
                            value={formData.bio.location}
                            onChange={(e) => handleChange(e, 'bio')}
                            style={inputStyle}
                        />
                    </label>

                    <label style={labelStyle}>
                        <span style={spanStyle}>Craft Specialization</span>
                        <input
                            type="text"
                            name="craftSpecialization"
                            value={formData.bio.craftSpecialization}
                            onChange={(e) => handleChange(e, 'bio')}
                            style={inputStyle}
                        />
                    </label>

                    <label style={labelStyle}>
                        <span style={spanStyle}>Personal Story</span>
                        <textarea
                            name="personalStory"
                            value={formData.bio.personalStory}
                            onChange={(e) => handleChange(e, 'bio')}
                            style={textareaStyle}
                            rows="4"
                        ></textarea>
                    </label>

                    <button
                        type="submit"
                        style={buttonStyle}
                    >
                        Generate Bio
                    </button>
                </form>
            );
        } else if (feature === 'content') {
            return (
                <form onSubmit={handleContentSubmit} style={formContainerStyle}>
                    <label style={labelStyle}>
                        <span style={spanStyle}>Product Name</span>
                        <input
                            type="text"
                            name="productName"
                            value={formData.content.productName}
                            onChange={(e) => handleChange(e, 'content')}
                            style={inputStyle}
                        />
                    </label>

                    <label style={labelStyle}>
                        <span style={spanStyle}>Key Materials</span>
                        <input
                            type="text"
                            name="keyMaterials"
                            value={formData.content.keyMaterials}
                            onChange={(e) => handleChange(e, 'content')}
                            style={inputStyle}
                        />
                    </label>

                    <label style={labelStyle}>
                        <span style={spanStyle}>Artisan Notes</span>
                        <textarea
                            name="artisanNotes"
                            value={formData.content.artisanNotes}
                            onChange={(e) => handleChange(e, 'content')}
                            style={textareaStyle}
                            rows="4"
                        ></textarea>
                    </label>

                    <button
                        type="submit"
                        style={buttonStyle}
                    >
                        Generate Content
                    </button>
                    <button
                        type="button"
                        onClick={() => setFeature('bio')}
                        style={goBackButton}
                    >
                        Go Back
                    </button>
                </form>
            );
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={titleStyle}>
                    {feature === 'bio'
                        ? '"About The Artisan" Bio Generation'
                        : 'Product Content Generation'}
                </h1>
                <div style={mainContentStyle}>
                    <div style={inputSectionStyle}>
                        {renderForm()}
                    </div>
                    <div style={outputSectionStyle}>
                        {generatedBio && (
                            <div style={resultBoxStyle}>
                                <h2 style={resultTitleStyle}>Generated Bio</h2>
                                <p style={resultTextStyle}>{generatedBio}</p>
                                <button
                                    onClick={() => setFeature('content')}
                                    style={nextButtonStyle}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                        {generatedContent && (
                            <div style={resultBoxStyle}>
                                <h2 style={resultTitleStyle}>Generated Content</h2>
                                <p style={resultTextStyle}>{generatedContent}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// CSS styles as JavaScript objects
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    backgroundColor: "transparent",
    minHeight: '100vh',
    fontFamily: 'sans-serif',
    
};

const cardStyle = {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    width: '100%',
    maxWidth: '1200px',
    overflowY: 'auto',
};

const titleStyle = {
    fontSize: '30px',
    fontWeight: '700',
    color: 'rgb(59, 130, 246)',
    marginBottom: '24px',
    textAlign: 'center',
};

const mainContentStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '32px',
};

const inputSectionStyle = {
    flex: '1',
    minWidth: '300px',
};

const outputSectionStyle = {
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
};

const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
};

const labelStyle = {
    display: 'block',
};

const spanStyle = {
    color: '#4b5563',
    display: 'block',
    marginBottom: '4px',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    color: 'black',
    border: '1px solid #d1d5db',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    outline: 'none',
};

const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
};

const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontWeight: '700',
    padding: '8px 16px',
    borderRadius: '6px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
};

const goBackButton = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
    marginTop: '8px',
};

const resultBoxStyle = {
    padding: '24px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    border: '2px solid #bbf7d0',
};

const resultTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#166534',
    marginBottom: '8px',
};

const resultTextStyle = {
    color: '#374151',
    lineHeight: '1.6',
};

const nextButtonStyle = {
    ...buttonStyle,
    marginTop: '16px',
    backgroundColor: '#10b981',
};

export default CGPage;

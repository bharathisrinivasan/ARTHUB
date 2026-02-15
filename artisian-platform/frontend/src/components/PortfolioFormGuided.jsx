import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Tag, MessageSquare, Image, Loader2 } from 'lucide-react';
import './PortfolioFormGuided.css';

// Define structured options for dropdowns
const CATEGORY_OPTIONS = ["Pottery", "Textile", "Jewelry", "Home Decor", "Art Piece", "Others"];
const MATERIAL_OPTIONS = ["Clay", "Fabric", "Wood", "Metal", "Mixed Media", "Other"];

const PortfolioFormGuided = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: CATEGORY_OPTIONS[0],
        material_type: MATERIAL_OPTIONS[0],
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem('token');

    // Effect to check auth on load
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    // Handle standard text/select inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file selection and preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Step validation before moving to Step 2
    const handleNextStep = () => {
        if (!formData.title || !formData.description) {
            alert("Please complete the title and description before proceeding.");
            return;
        }
        setStep(2);
    };

    // Form submission logic (Step 2)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            alert("Please upload an image for your portfolio piece.");
            return;
        }
        setIsSubmitting(true);

        try {
            let imagePath = '';
            
            // --- 1. UPLOAD IMAGE FILE ---
            const fileData = new FormData();
            fileData.append('image', imageFile); 

            const uploadResponse = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: { 'x-auth-token': token },
                body: fileData, 
            });

            if (!uploadResponse.ok) {
                const uploadError = await uploadResponse.json();
                throw new Error(uploadError.message || "Image upload failed.");
            }
            const uploadData = await uploadResponse.json();
            imagePath = uploadData.filePath;

            // --- 2. SUBMIT PORTFOLIO DETAILS ---
            const finalPortfolioData = { ...formData, media_url: imagePath };
            
            const detailResponse = await fetch('http://localhost:5000/api/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(finalPortfolioData),
            });

            if (!detailResponse.ok) {
                 throw new Error("Failed to save portfolio details.");
            }

            // SUCCESS
            alert("Your work has been added to your portfolio! ✅");
            // CORRECTED REDIRECT: Go to the dedicated management list page
            navigate('/portfolio/manage'); 
            
        } catch (error) {
            console.error("Submission error:", error.message);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <div className="form-step fade-in">
            <div className="form-group">
                <label><Zap size={18} /> Project Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a short title for your work..."
                    required
                />
            </div>

            <div className="form-group">
                <label><MessageSquare size={18} /> Detailed Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your process, materials, and inspiration."
                    rows="5"
                    required
                />
            </div>
            
            <div className="input-group-row">
                <div className="form-group">
                    <label><Tag size={18} /> Category</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label><Tag size={18} /> Material Type</label>
                    <select name="material_type" value={formData.material_type} onChange={handleChange}>
                        {MATERIAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
                    Cancel
                </button>
                <button type="button" onClick={handleNextStep} className="btn-primary">
                    Next: Upload Media →
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <form onSubmit={handleSubmit} className="form-step fade-in">
            <div className="form-group">
                <label><Image size={18} /> Image Upload (Max 1)</label>
                <div className="file-upload-area" onDragOver={(e) => e.preventDefault()}>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept="image/*,video/*" 
                        required 
                        className="file-input-hidden"
                    />
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                    ) : (
                        <p className="drag-drop-text">Drag and Drop or Click to Upload</p>
                    )}
                </div>
            </div>
            
            <div className="form-actions">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                    ← Back
                </button>
                <button type="submit" className="btn-primary gradient-submit" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 size={18} className="spinner" /> Saving...</> : 'Save Portfolio'}
                </button>
            </div>
        </form>
    );

    return (
        <div className="portfolio-form-container">
            <h2 className="form-title">Add New Project to Showcase</h2>
            
            <div className="progress-indicator">
                <div className={`step-circle ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className="progress-line"></div>
                <div className={`step-circle ${step >= 2 ? 'active' : ''}`}>2</div>
            </div>
            <p className="step-label">Step {step}: {step === 1 ? 'Basic Details' : 'Media Upload'}</p>

            <div className="form-card">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
            </div>
        </div>
    );
};

export default PortfolioFormGuided;
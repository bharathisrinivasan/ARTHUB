import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Briefcase,
  Globe,
  Award,
  Instagram,
  Facebook,
  Youtube,
  Link as LinkIcon,
  Plus,
  X,
  Upload
} from 'lucide-react';
import './PortfolioDetails.css';

const PortfolioDetails = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    tagline: '',
    location: '',
    profile_image: null,
    cover_image: null,
    preview_profile: null,
    preview_cover: null
  });

  // About Info State
  const [aboutInfo, setAboutInfo] = useState({
    about: '',
    specialization: '',
    experience: '',
    language: ''
  });

  // Works State
  const [works, setWorks] = useState([]);
  const [currentWork, setCurrentWork] = useState({
    title: '',
    category: '',
    description: '',
    images: [],
    price_range: '',
    available_for_order: true
  });

  // Achievements State
  const [achievements, setAchievements] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState({
    title: '',
    year: new Date().getFullYear(),
    description: '',
    award_image: null,
    preview_image: null
  });

  // Social Links State
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    youtube: '',
    website: ''
  });

  // Handle image previews
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'profile' || type === 'cover') {
        setBasicInfo(prev => ({
          ...prev,
          [type + '_image']: file,
          ['preview_' + type]: URL.createObjectURL(file)
        }));
      } else if (type === 'work') {
        setCurrentWork(prev => ({
          ...prev,
          images: [...prev.images, file]
        }));
      } else if (type === 'achievement') {
        setCurrentAchievement(prev => ({
          ...prev,
          award_image: file,
          preview_image: URL.createObjectURL(file)
        }));
      }
    }
  };

  // Add work to list
  const handleAddWork = () => {
    if (currentWork.title && currentWork.category) {
      setWorks(prev => [...prev, { ...currentWork, id: Date.now() }]);
      setCurrentWork({
        title: '',
        category: '',
        description: '',
        images: [],
        price_range: '',
        available_for_order: true
      });
    }
  };

  // Add achievement to list
  const handleAddAchievement = () => {
    if (currentAchievement.title && currentAchievement.year) {
      setAchievements(prev => [...prev, { ...currentAchievement, id: Date.now() }]);
      setCurrentAchievement({
        title: '',
        year: new Date().getFullYear(),
        description: '',
        award_image: null,
        preview_image: null
      });
    }
  };

  // Remove work from list
  const handleRemoveWork = (workId) => {
    setWorks(prev => prev.filter(work => work.id !== workId));
  };

  // Remove achievement from list
  const handleRemoveAchievement = (achievementId) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== achievementId));
  };

  // Submit portfolio data
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for profile
      const profileFormData = new FormData();
      Object.keys(basicInfo).forEach(key => {
        if (key !== 'preview_profile' && key !== 'preview_cover') {
          profileFormData.append(key, basicInfo[key]);
        }
      });
      Object.keys(aboutInfo).forEach(key => {
        profileFormData.append(key, aboutInfo[key]);
      });

      // Submit profile data
      const profileResponse = await fetch('/api/portfolio/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: profileFormData
      });

      if (!profileResponse.ok) throw new Error('Failed to save profile');

      // Submit works
      for (const work of works) {
        const workFormData = new FormData();
        workFormData.append('title', work.title);
        workFormData.append('category', work.category);
        workFormData.append('description', work.description);
        workFormData.append('price_range', work.price_range);
        workFormData.append('available_for_order', work.available_for_order);
        
        work.images.forEach(image => {
          workFormData.append('work_images', image);
        });

        const workResponse = await fetch('/api/portfolio/work', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: workFormData
        });

        if (!workResponse.ok) throw new Error('Failed to save work');
      }

      // Submit achievements
      for (const achievement of achievements) {
        const achievementFormData = new FormData();
        achievementFormData.append('title', achievement.title);
        achievementFormData.append('year', achievement.year);
        achievementFormData.append('description', achievement.description);
        if (achievement.award_image) {
          achievementFormData.append('award_image', achievement.award_image);
        }

        const achievementResponse = await fetch('/api/portfolio/achievement', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: achievementFormData
        });

        if (!achievementResponse.ok) throw new Error('Failed to save achievement');
      }

      // Submit social links
      const socialResponse = await fetch('/api/portfolio/social-links', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(socialLinks)
      });

      if (!socialResponse.ok) throw new Error('Failed to save social links');

      // Redirect to portfolio view
      navigate('/portfolio/manage');
    } catch (error) {
      console.error('Error submitting portfolio:', error);
      alert('Failed to save portfolio. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: 'Basic Info',
      content: (
        <div className="form-section">
          <h2><Camera className="icon" /> Basic Information</h2>
          
          <div className="image-uploads">
            <div className="upload-box profile">
              <label>
                {basicInfo.preview_profile ? (
                  <img src={basicInfo.preview_profile} alt="Profile Preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Upload className="icon" />
                    <span>Upload Profile Photo</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'profile')}
                />
              </label>
            </div>

            <div className="upload-box cover">
              <label>
                {basicInfo.preview_cover ? (
                  <img src={basicInfo.preview_cover} alt="Cover Preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Upload className="icon" />
                    <span>Upload Cover Image</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'cover')}
                />
              </label>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={basicInfo.name}
                onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Tagline</label>
              <input
                type="text"
                value={basicInfo.tagline}
                onChange={(e) => setBasicInfo({ ...basicInfo, tagline: e.target.value })}
                placeholder="e.g., Master Craftsman with 10 years experience"
              />
            </div>

            <div className="form-group">
              <label>
                <MapPin className="icon" /> Location
              </label>
              <input
                type="text"
                value={basicInfo.location}
                onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                placeholder="City, State"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'About',
      content: (
        <div className="form-section">
          <h2><Briefcase className="icon" /> Professional Information</h2>
          
          <div className="form-group">
            <label>About Me</label>
            <textarea
              value={aboutInfo.about}
              onChange={(e) => setAboutInfo({ ...aboutInfo, about: e.target.value })}
              placeholder="Tell your story..."
              rows={5}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                value={aboutInfo.specialization}
                onChange={(e) => setAboutInfo({ ...aboutInfo, specialization: e.target.value })}
                placeholder="e.g., Woodworking, Pottery"
              />
            </div>

            <div className="form-group">
              <label>Experience</label>
              <input
                type="text"
                value={aboutInfo.experience}
                onChange={(e) => setAboutInfo({ ...aboutInfo, experience: e.target.value })}
                placeholder="e.g., 5 years"
              />
            </div>

            <div className="form-group">
              <label>Languages</label>
              <input
                type="text"
                value={aboutInfo.language}
                onChange={(e) => setAboutInfo({ ...aboutInfo, language: e.target.value })}
                placeholder="e.g., English, Hindi"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Works',
      content: (
        <div className="form-section">
          <h2><Briefcase className="icon" /> Portfolio Works</h2>
          
          <div className="work-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={currentWork.title}
                  onChange={(e) => setCurrentWork({ ...currentWork, title: e.target.value })}
                  placeholder="Work title"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={currentWork.category}
                  onChange={(e) => setCurrentWork({ ...currentWork, category: e.target.value })}
                  placeholder="e.g., Pottery, Woodwork"
                />
              </div>

              <div className="form-group">
                <label>Price Range</label>
                <input
                  type="text"
                  value={currentWork.price_range}
                  onChange={(e) => setCurrentWork({ ...currentWork, price_range: e.target.value })}
                  placeholder="e.g., ₹1000-₹2000"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={currentWork.description}
                onChange={(e) => setCurrentWork({ ...currentWork, description: e.target.value })}
                placeholder="Describe your work..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Images (up to 10)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e, 'work')}
              />
            </div>

            <button type="button" className="btn-add" onClick={handleAddWork}>
              <Plus className="icon" /> Add Work
            </button>
          </div>

          <div className="works-grid">
            {works.map(work => (
              <div key={work.id} className="work-card">
                {work.images[0] && (
                  <img src={URL.createObjectURL(work.images[0])} alt={work.title} />
                )}
                <div className="work-info">
                  <h3>{work.title}</h3>
                  <p>{work.category}</p>
                  <p className="price">{work.price_range}</p>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveWork(work.id)}
                  >
                    <X className="icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Achievements',
      content: (
        <div className="form-section">
          <h2><Award className="icon" /> Achievements</h2>
          
          <div className="achievement-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={currentAchievement.title}
                  onChange={(e) => setCurrentAchievement({ ...currentAchievement, title: e.target.value })}
                  placeholder="Achievement title"
                />
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={currentAchievement.year}
                  onChange={(e) => setCurrentAchievement({ ...currentAchievement, year: e.target.value })}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={currentAchievement.description}
                onChange={(e) => setCurrentAchievement({ ...currentAchievement, description: e.target.value })}
                placeholder="Describe your achievement..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Award Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'achievement')}
              />
              {currentAchievement.preview_image && (
                <img
                  src={currentAchievement.preview_image}
                  alt="Award Preview"
                  className="award-preview"
                />
              )}
            </div>

            <button type="button" className="btn-add" onClick={handleAddAchievement}>
              <Plus className="icon" /> Add Achievement
            </button>
          </div>

          <div className="achievements-list">
            {achievements.map(achievement => (
              <div key={achievement.id} className="achievement-card">
                {achievement.preview_image && (
                  <img src={achievement.preview_image} alt={achievement.title} />
                )}
                <div className="achievement-info">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.year}</p>
                  <p>{achievement.description}</p>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveAchievement(achievement.id)}
                  >
                    <X className="icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Social Links',
      content: (
        <div className="form-section">
          <h2><Globe className="icon" /> Social Media Links</h2>
          
          <div className="social-links-form">
            <div className="form-group">
              <label>
                <Instagram className="icon" /> Instagram
              </label>
              <input
                type="url"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                placeholder="https://instagram.com/yourusername"
              />
            </div>

            <div className="form-group">
              <label>
                <Facebook className="icon" /> Facebook
              </label>
              <input
                type="url"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                placeholder="https://facebook.com/yourusername"
              />
            </div>

            <div className="form-group">
              <label>
                <Youtube className="icon" /> YouTube
              </label>
              <input
                type="url"
                value={socialLinks.youtube}
                onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                placeholder="https://youtube.com/yourchannel"
              />
            </div>

            <div className="form-group">
              <label>
                <LinkIcon className="icon" /> Website
              </label>
              <input
                type="url"
                value={socialLinks.website}
                onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="portfolio-details-page">
      <div className="stepper">
        {steps.map((step, index) => (
          <button
            key={index}
            className={`step ${index === activeStep ? 'active' : ''} ${
              index < activeStep ? 'completed' : ''
            }`}
            onClick={() => setActiveStep(index)}
          >
            {step.title}
          </button>
        ))}
      </div>

      <div className="form-container">
        {steps[activeStep].content}

        <div className="navigation-buttons">
          {activeStep > 0 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setActiveStep(prev => prev - 1)}
            >
              Previous
            </button>
          )}
          
          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setActiveStep(prev => prev + 1)}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn-submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Portfolio'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetails;
const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;
        // Determine the appropriate upload path based on the field name
        if (file.fieldname === 'profile_image' || file.fieldname === 'cover_image') {
            uploadPath = path.join(__dirname, '../uploads/portfolio/profile');
        } else if (file.fieldname === 'work_images') {
            uploadPath = path.join(__dirname, '../uploads/portfolio/works');
        } else if (file.fieldname === 'award_image') {
            uploadPath = path.join(__dirname, '../uploads/portfolio/achievements');
        } else {
            uploadPath = path.join(__dirname, '../uploads/portfolio');
        }
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: Images Only!'));
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Create/Update artisan profile
router.post('/profile', auth, function(req, res, next) {
    upload.fields([
        { name: 'profile_image', maxCount: 1 },
        { name: 'cover_image', maxCount: 1 }
    ])(req, res, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const artisanId = req.user.id;
        let profileData = { ...req.body };

        // Handle file uploads
        if (req.files) {
            if (req.files.profile_image) {
                profileData.profile_image = `/uploads/portfolio/${req.files.profile_image[0].filename}`;
            }
            if (req.files.cover_image) {
                profileData.cover_image = `/uploads/portfolio/${req.files.cover_image[0].filename}`;
            }
        }

        await Portfolio.upsertArtisanProfile(artisanId, profileData);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Add/Update work
router.post('/work', auth, function(req, res, next) {
    upload.array('work_images', 10)(req, res, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const artisanId = req.user.id;
        let workData = { ...req.body, artisan_id: artisanId };

        // Handle work images
        if (req.files && req.files.length > 0) {
            workData.image_urls = req.files.map(file => `/uploads/portfolio/${file.filename}`);
        }

        await Portfolio.upsertWork(workData);
        res.json({ message: 'Work added/updated successfully' });
    } catch (error) {
        console.error('Error adding/updating work:', error);
        res.status(500).json({ error: 'Error adding/updating work' });
    }
});

// Add/Update achievement
router.post('/achievement', auth, function(req, res, next) {
    upload.single('award_image')(req, res, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const artisanId = req.user.id;
        let achievementData = { ...req.body, artisan_id: artisanId };

        if (req.file) {
            achievementData.award_image = `/uploads/portfolio/${req.file.filename}`;
        }

        await Portfolio.upsertAchievement(achievementData);
        res.json({ message: 'Achievement added/updated successfully' });
    } catch (error) {
        console.error('Error adding/updating achievement:', error);
        res.status(500).json({ error: 'Error adding/updating achievement' });
    }
});

// Update social links
router.post('/social-links', auth, async (req, res) => {
    try {
        const artisanId = req.user.id;
        await Portfolio.upsertSocialLinks(artisanId, req.body);
        res.json({ message: 'Social links updated successfully' });
    } catch (error) {
        console.error('Error updating social links:', error);
        res.status(500).json({ error: 'Error updating social links' });
    }
});

// Get portfolio by artisan ID
router.get('/:artisanId', async (req, res) => {
    try {
        const portfolio = await Portfolio.getPortfolioByArtisanId(req.params.artisanId);
        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }
        res.json(portfolio);
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ error: 'Error fetching portfolio' });
    }
});

// Delete work item
router.delete('/work/:workId', auth, async (req, res) => {
    try {
        const artisanId = req.user.id;
        await Portfolio.deleteWork(req.params.workId, artisanId);
        res.json({ message: 'Work deleted successfully' });
    } catch (error) {
        console.error('Error deleting work:', error);
        res.status(500).json({ error: 'Error deleting work' });
    }
});

// Delete achievement
router.delete('/achievement/:achievementId', auth, async (req, res) => {
    try {
        const artisanId = req.user.id;
        await Portfolio.deleteAchievement(req.params.achievementId, artisanId);
        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        res.status(500).json({ error: 'Error deleting achievement' });
    }
});

module.exports = router;

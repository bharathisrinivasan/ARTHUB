import express from 'express';
import multer from 'multer';
import {
  createPortfolio,
  addWork,
  addAchievement,
  addSocialLinks,
  getPortfolioById
} from '../controllers/portfolioController.js';
import auth from '../authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Save basic artisan profile
router.post('/profile', auth, upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), createPortfolio);

// Add work
router.post('/work', auth, upload.array('work_images', 10), addWork);

// Add achievement
router.post('/achievement', auth, upload.single('award_image'), addAchievement);

// Add social links
router.post('/social-links', auth, addSocialLinks);

// Fetch full portfolio by artisanId
router.get('/:artisanId', getPortfolioById);

export default router;
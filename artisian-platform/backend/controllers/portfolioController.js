import asyncHandler from 'express-async-handler';

// Temporary in-memory database
let portfolios = {};

export const createPortfolio = asyncHandler(async (req, res) => {
  const { name, tagline, location, about, specialization, experience, language } = req.body;
  const profile_image = req.files['profile_image'] ? req.files['profile_image'][0].buffer.toString('base64') : null;
  const cover_image = req.files['cover_image'] ? req.files['cover_image'][0].buffer.toString('base64') : null;

  const userId = req.user ? req.user.id : 'demoUser';

  portfolios[userId] = {
    userId,
    name,
    tagline,
    location,
    about,
    specialization,
    experience,
    language,
    profile_image,
    cover_image,
    works: [],
    achievements: [],
    socialLinks: {}
  };

  res.json({ message: 'Portfolio profile saved successfully' });
});

export const addWork = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : 'demoUser';
  const { title, category, description, price_range, available_for_order } = req.body;
  const work_images = req.files.map(f => f.buffer.toString('base64'));

  if (!portfolios[userId]) return res.status(400).json({ message: 'Portfolio not found' });

  portfolios[userId].works.push({
    work_id: Date.now(),
    title,
    category,
    description,
    price_range,
    available_for_order,
    image_urls: work_images
  });

  res.json({ message: 'Work added successfully' });
});

export const addAchievement = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : 'demoUser';
  const { title, year, description } = req.body;
  const award_image = req.file ? req.file.buffer.toString('base64') : null;

  if (!portfolios[userId]) return res.status(400).json({ message: 'Portfolio not found' });

  portfolios[userId].achievements.push({
    achievement_id: Date.now(),
    title,
    year,
    description,
    award_image
  });

  res.json({ message: 'Achievement added successfully' });
});

export const addSocialLinks = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.id : 'demoUser';
  const { instagram, facebook, youtube, website } = req.body;

  if (!portfolios[userId]) return res.status(400).json({ message: 'Portfolio not found' });

  portfolios[userId].socialLinks = { instagram, facebook, youtube, website };

  res.json({ message: 'Social links saved successfully' });
});

export const getPortfolioById = asyncHandler(async (req, res) => {
  const artisanId = req.params.artisanId;
  const portfolio = portfolios[artisanId];
  if (!portfolio) {
    return res.status(404).json({ message: 'Portfolio not found' });
  }
  res.json(portfolio);
});
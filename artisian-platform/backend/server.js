// backend/server.js
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import auth from './authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import portfolioRoutes from './routes/portfolioRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// =======================
// Multer setup for uploads
// =======================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, 'uploads/portfolio/');

    // Determine subdirectory based on file type
    if (file.fieldname === 'profile_image' || file.fieldname === 'cover_image') {
      uploadPath = path.join(uploadPath, 'profile');
    } else if (file.fieldname === 'work_images') {
      uploadPath = path.join(uploadPath, 'works');
    } else if (file.fieldname === 'award_image') {
      uploadPath = path.join(uploadPath, 'achievements');
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

app.use(cors());
app.use(express.json());

// Ensure uploads directories exist
const uploadDirs = ['uploads', 'uploads/portfolio'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Use portfolio routes
app.use('/api/portfolio', portfolioRoutes);

// ===================================
// PUBLIC ROUTES
// ===================================

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password, craft_type, location, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const sql = `INSERT INTO Users (name, email, password_hash, craft_type, location, role) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [name, email, hashedPassword, craft_type, location, role];
  db.query(sql, values, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email already exists.' });
      }
      console.error(err);
      return res.status(500).json({ message: 'Server error during signup.' });
    }
    res.status(201).json({ message: 'User registered successfully!' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM Users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error during login.' });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials.' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Logged in successfully!', token, user });
  });
});

// Products public route
app.get('/api/products', (req, res) => {
  const sql = 'SELECT * FROM Products';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    res.status(200).json(results);
  });
});

// Single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Products WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    if (result.length === 0) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json(result[0]);
  });
});

// Contact form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Contact:', { name, email, message });
  res.status(200).json({ message: 'Thank you for your message!' });
});

// Blogs
app.get('/api/blogs', (req, res) => {
  const sql = 'SELECT * FROM Blogs ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error while fetching blogs.' });
    res.status(200).json(results);
  });
});

// Single Blog
app.get('/api/blogs/:blogId', (req, res) => {
  const { blogId } = req.params;
  const sql = 'SELECT * FROM Blogs WHERE id = ?';
  db.query(sql, [blogId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    if (result.length === 0) return res.status(404).json({ message: 'Blog post not found.' });
    res.status(200).json(result[0]);
  });
});

// Artisan Profile
app.get('/api/artisan/profile/:artisanId', (req, res) => {
  const { artisanId } = req.params;
  const sql = 'SELECT name, craft_type, location, bio, profile_photo_url FROM Users WHERE id = ?';
  db.query(sql, [artisanId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    if (result.length === 0) return res.status(404).json({ message: 'Artisan not found.' });
    res.status(200).json(result[0]);
  });
});

// ===================================
// PROTECTED ROUTES
// ===================================

app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  res.status(200).json({ message: 'File uploaded successfully!', filePath: `/uploads/${req.file.filename}` });
});

// Product CRUD
app.post('/api/products', auth, (req, res) => {
  const { title, description, price, category, cultural_story, is_customizable, stock_count, image_url } = req.body;
  const artisan_id = req.user.id;
  const sql = `INSERT INTO Products (artisan_id, title, description, price, category, cultural_story, is_customizable, stock_count, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [artisan_id, title, description, price, category, cultural_story, is_customizable, stock_count, image_url];
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ message: 'Server error while adding product.' });
    res.status(201).json({ message: 'Product added successfully!' });
  });
});

app.get('/api/artisan/products', auth, (req, res) => {
  const artisan_id = req.user.id;
  const sql = 'SELECT * FROM Products WHERE artisan_id = ?';
  db.query(sql, [artisan_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    res.status(200).json(results);
  });
});

// Update product
app.put('/api/products/:id', auth, (req, res) => {
  const { id } = req.params;
  const artisan_id = req.user.id;
  const { title, description, price, category, cultural_story, is_customizable, stock_count } = req.body;
  const sql = `UPDATE Products SET title=?, description=?, price=?, category=?, cultural_story=?, is_customizable=?, stock_count=? WHERE id=? AND artisan_id=?`;
  const values = [title, description, price, category, cultural_story, is_customizable, stock_count, id, artisan_id];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found or unauthorized.' });
    res.status(200).json({ message: 'Product updated successfully!' });
  });
});

// Delete product
app.delete('/api/products/:id', auth, (req, res) => {
  const { id } = req.params;
  const artisan_id = req.user.id;
  const sql = 'DELETE FROM Products WHERE id = ? AND artisan_id = ?';
  db.query(sql, [id, artisan_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found or unauthorized.' });
    res.status(200).json({ message: 'Product deleted successfully!' });
  });
});

app.post('/api/orders', auth, (req, res) => {
  const buyer_id = req.user.id;
  const { cart } = req.body;
  if (!cart || cart.length === 0) { return res.status(400).json({ message: 'Cart is empty.' }); }
  const orderPromises = cart.map(item => new Promise((resolve, reject) => {
    const sql = `INSERT INTO Orders (buyer_id, product_id, quantity, total_price, status, artisan_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [ buyer_id, item.id, item.quantity, item.price * item.quantity, 'pending', item.artisan_id ];
    db.query(sql, values, (err) => {
      if (err) { reject(err); } else { resolve(); }
    });
  }));
  Promise.all(orderPromises).then(() => { res.status(201).json({ message: 'Order placed successfully!' }); }).catch(err => { console.error('Order placement error:', err); res.status(500).json({ message: 'Server error while placing order.' }); });
});

app.get('/api/orders/buyer', auth, (req, res) => {
  const buyer_id = req.user.id;
  const sql = `
    SELECT 
      o.id as order_id, o.quantity, o.total_price, o.status, o.created_at,
      p.title as product_title, p.image_url as product_image, u.name as artisan_name
    FROM Orders o
    JOIN Products p ON o.product_id = p.id
    JOIN Users u ON o.artisan_id = u.id
    WHERE o.buyer_id = ?
    ORDER BY o.created_at DESC;
  `;
  db.query(sql, [buyer_id], (err, results) => {
    if (err) { console.error('Database query error:', err); return res.status(500).json({ message: 'Server error while fetching orders.' }); }
    res.status(200).json(results);
  });
});


// --- Global Error Handler ---
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer Error:', err);
    return res.status(500).json({ message: `File upload failed: ${err.message}` });
  }
  if (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ message: 'An unexpected server error occurred.' });
  }
  next();
});

// =======================
// Start the server
// =======================
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

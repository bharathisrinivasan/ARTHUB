🏺 Artisan Platform (ArtHub)

Artisan Platform is a full-stack, role-based e-commerce ecosystem designed to empower local artisans. It bridges the gap between traditional craft and global markets by integrating professional storytelling (blogs and portfolios) directly with a robust e-commerce pipeline.

📸 Demo & Screenshots

Add your screenshots or a GIF demo here to showcase the UI!

Artisan Dashboard

Buyer Marketplace





🚀 Key Features

🛠 For Artisans (Management Side)

Role-Based Dashboard: A secure workspace for managing business operations and viewing statistics.

Product CRUD: Full control over product inventory with secure image upload support.

Digital Portfolio: Showcase craft techniques, material expertise, and notable past works.

Cultural Blog: A built-in CMS to share the stories behind the art, building brand trust and identity.

Order Tracking: View and monitor buyer purchases and customer details.

🛒 For Buyers (Marketplace Side)

Immersive Discovery: Browse products accompanied by the artisan's personal narrative and cultural background.

Persistent Shopping Experience: A local-storage-backed cart that persists across browser sessions.

Secure Checkout: Seamless transition from cart management to order placement.

Profile Exploration: View detailed artisan portfolios and achievements before making a purchase.

📂 Project Structure

artisan-platform/
├── backend/
│   ├── config/            # MySQL Database connection configuration
│   ├── uploads/           # Physical storage for product and portfolio images
│   ├── authMiddleware.js  # JWT validation and role-based access logic
│   └── server.js          # Express API entry point & RESTful routes
├── src/                   # React Frontend (Vite)
│   ├── components/        # Shared UI components (Navbar, PrivateRoute, etc.)
│   ├── pages/             # Role-specific views (Dashboard, Cart, Products, Portfolio)
│   ├── App.jsx            # React Router and global state configuration
│   └── main.jsx           # App initialization
└── README.md


⚙️ Installation & Setup

1. Database Setup (MySQL)

Create a database named artisan_db and execute the following schema to initialize the tables:

-- Core User Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('artisan', 'buyer') DEFAULT 'buyer',
    craft_type VARCHAR(100),
    bio TEXT,
    profile_photo_url VARCHAR(255)
);

-- Products Table
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artisan_id INT,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    image_url VARCHAR(255),
    cultural_story TEXT,
    FOREIGN KEY (artisan_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Note: Ensure tables for Portfolios, Blogs, and Orders are also created.


2. Backend Configuration

Navigate to the /backend folder and create a .env file with the following variables:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=artisan_db
JWT_SECRET=your_secure_jwt_secret_key
PORT=5000


Install dependencies and start the server:

cd backend
npm install
node server.js


3. Frontend Configuration

Navigate to the root directory from a new terminal:

npm install
npm run dev


The application will typically be available at http://localhost:5173.

🛡️ API Endpoints (Samples)

Method

Endpoint

Description

Auth Required

POST

/api/signup

Register new user (Artisan/Buyer)

No

POST

/api/login

Authenticate user & receive JWT

No

GET

/api/products

Fetch all available marketplace products

No

POST

/api/upload

Securely upload image files to server

Yes

POST

/api/orders

Process shopping cart checkout

Yes

🔮 Future Scope

Real-time Chat: Direct buyer-to-artisan communication using Socket.io for custom orders.

Payment Gateway: Full integration with Stripe or Razorpay for live transactions.

AI Content Assistant: Leveraging Gemini API to assist artisans in writing SEO-friendly product descriptions.

Cloud Storage: Migration from local /uploads to AWS S3 or Firebase for production scalability.

👥 Contributors

Bharathi - Lead Developer (Architecture, Backend, & Database)

[Friend's Name] - UI/UX Designer & Frontend Developer

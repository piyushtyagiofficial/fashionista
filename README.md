# Fashionista — Your Modern Fashion Destination

Fashionista is a sleek and user-centric full-stack e-commerce platform designed for fashion enthusiasts. Built using the MERN (MongoDB, Express, React, Node.js) stack, the app offers a seamless shopping experience with secure payments, real-time cart management, and personalized order tracking.

 **Key Features:**
-  **Product Listings:** Browse a wide range of fashion products with dynamic filtering by size, color, and price.
-  **User Accounts:** Authentication, profile management, and address prefill for quick checkouts.
-  **Smart Cart System:** Add, update, or remove products with instant price calculations.
-  **Secure Payments:** Integrated with Razorpay for real-time, encrypted transactions.
-  **Order Management:** Track your past orders and shipping details with ease.
-  **Seller Module:** Add product details, manage inventory, and view order requests.

🔧 **Tech Stack:**
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT & Context API
- **Payments:** Razorpay

---

## Environment Variables Setup

### Server (`server/.env`)
Create a `.env` file in the `server` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
PORT=5000
NODE_ENV=development
```

### Client (`client/.env`)
Create a `.env` file in the `client` directory with the following variables:

```
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## Client (Frontend)

**Location:** `client/`

The client is a React application built with Vite. It provides the user interface for buyers and sellers, including authentication, product browsing, cart management, and chat features.

### Main Structure
- `public/` — Static assets
- `src/`
  - `assets/` — Images and static files
  - `components/` — UI components, organized by feature:
    - `auth/` — Login, Register
    - `buyer/` — Cart, Checkout, ProductDetail, ProductList
    - `chat/` — Chatbot
    - `common/` — Alert, Loader, ProductCard
    - `layout/` — Navbar, Footer
    - `routing/` — PrivateRoute, SellerRoute
    - `seller/` — Dashboard, OrdersList, ProductForm
  - `context/` — React context providers (auth, cart, product)
  - `pages/` — Page components for routes (Dashboard, CartPage, CheckoutPage, etc.)
  - `utils/` — API utilities
- `index.html`, `App.jsx`, `main.jsx` — Entry points
- `tailwind.config.js`, `postcss.config.js` — Styling config

### Main API Breakpoints (Frontend Usage)
- `/api/auth/register` — Register user
- `/api/auth/login` — Login user
- `/api/auth/profile` — Get/update user profile
- `/api/auth/wishlist` — Add/get/remove wishlist items
- `/api/products` — Get all products
- `/api/products/:id` — Get, update, or delete a product
- `/api/products/:id/reviews` — Add a review
- `/api/products/seller/products` — Seller's products
- `/api/orders` — Create order
- `/api/orders/myorders` — Get buyer's orders
- `/api/orders/seller` — Get seller's orders
- `/api/orders/:id` — Get order by ID
- `/api/orders/:id/pay` — Verify payment
- `/api/orders/:id/status` — Update order status
- `/api/orders/create-payment` — Create payment intent
- `/api/upload` — Upload product images
- `/api/chatbot/message` — Chatbot interaction

### Setup Instructions

1. Navigate to the `client` directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. For production build:
   ```sh
   npm run build
   ```
5. To preview the production build:
   ```sh
   npm run preview
   ```
6. To lint the codebase:
   ```sh
   npm run lint
   ```

---

## Server (Backend)

**Location:** `server/`

The server is a Node.js/Express application providing RESTful APIs for authentication, product management, orders, chat, and more.

### Main Structure
- `server.js` — Entry point
- `config/` — Database config
- `controllers/` — Route handler logic
- `middleware/` — Custom middleware (auth, etc.)
- `models/` — Mongoose models (User, Product, Order)
- `routes/` — API route definitions (auth, products, orders, upload, cart, chatbot)
- `utils/` — Utility files (e.g., service account keys)

### Main API Breakpoints (Backend)
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `GET/PUT /api/auth/profile` — Get/update user profile
- `POST/DELETE/GET /api/auth/wishlist` — Add/remove/get wishlist items
- `GET /api/products` — Get all products
- `GET /api/products/:id` — Get product by ID
- `POST /api/products` — Create product (seller)
- `PUT /api/products/:id` — Update product (seller)
- `DELETE /api/products/:id` — Delete product (seller)
- `POST /api/products/:id/reviews` — Add review
- `GET /api/products/seller/products` — Seller's products
- `POST /api/orders` — Create order
- `GET /api/orders/myorders` — Get buyer's orders
- `GET /api/orders/seller` — Get seller's orders
- `GET /api/orders/:id` — Get order by ID
- `PUT /api/orders/:id/pay` — Verify payment
- `PUT /api/orders/:id/status` — Update order status
- `POST /api/orders/create-payment` — Create payment intent
- `POST /api/upload` — Upload product images
- `POST /api/chatbot/message` — Chatbot interaction

### Setup Instructions

1. Navigate to the `server` directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file (see `.env.example` if available).
4. Start the server:
   ```sh
   node server.js
   ```
   Or, if you use nodemon for development:
   ```sh
   npx nodemon server.js
   ```

---

## Getting Started

You can now run both the client and server as described above. Make sure your backend server is running before using the frontend for full functionality.

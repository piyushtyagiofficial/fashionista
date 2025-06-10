# Fashionista — Your Modern Fashion Destination

Fashionista is a sleek and user-centric full-stack e-commerce platform designed for fashion enthusiasts. Built using the MERN (MongoDB, Express, React, Node.js) stack, the app offers a seamless shopping experience with secure payments, real-time cart management, and personalized order tracking.

**Key Features:**
- **Product Listings:** Browse a wide range of fashion products with dynamic filtering by size, color, and price.
- **User Accounts:** Authentication, profile management, and address prefill for quick checkouts.
- **Smart Cart System:** Add, update, or remove products with instant price calculations.
- **Secure Payments:** Integrated with Razorpay for real-time, encrypted transactions.
- **Order Management:** Track your past orders.
- **Seller Module:** Add product details, manage inventory, and view order requests.

🔧 **Tech Stack:**
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT & Context API
- **Payments:** Razorpay

---

## Sign Up

![Sign Up Screenshot](https://drive.google.com/uc?export=view&id=17nhsI7Vs7bEgsKBYa4A8DFohQW43g12B)

## Log In

![Log In Screenshot](https://drive.google.com/uc?export=view&id=1qjbMZowOjg4XNYgVi2S-EPM0hfqdsbKQ)

## Home

![Home Screenshot](https://drive.google.com/uc?export=view&id=1Kf3mcxM7ZC60JUP-BJTdBT9Yt-mgO07l)

## Dashboard (User)

![User Dashboard Screenshot](https://drive.google.com/uc?export=view&id=1Eh0wVuh8Kz3zxy1Cl_wwLR7XTPiEDG5C)

## Dashboard (Seller)

![Seller Dashboard Screenshot](https://drive.google.com/uc?export=view&id=1u3mX0EhMLYWP1p2Nllv1nZu5gKaPl_6x)


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
EMAIL_HOST=smtp.your_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
EMAIL_FROM=your_info
FRONTEND_URL=http://localhost:5173
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
    - `buyer/` — Cart, Checkout, ProductDetail, ProductList, ProductReviews
    - `chat/` — Chatbot
    - `common/` — Alert, Loader, ProductCard
    - `layout/` — Navbar, Footer
    - `routing/` — PrivateRoute, SellerRoute
    - `seller/` — Dashboard, OrdersList, ProductForm
  - `context/` — React context providers (auth, cart, product)
  - `pages/` — Page components for routes (BuyerDashboard, CartPage, CheckoutPage, Home, NotFound, OrdersPage, ProductDetailPage, ProductFormPage, ProductsPage, SellerDashboard, WishlistPage)
  - `utils/` — API utilities
- `index.html`, `App.jsx`, `main.jsx` — Entry points
- `tailwind.config.js`, `postcss.config.js` — Styling config


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
- `POST /api/orders/create-payment` — Create payment intent
- `POST /api/upload` — Upload product images

### Setup Instructions

1. Navigate to the `server` directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file (see above).
4. Start the server:
   ```sh
   node server.js
   ```
   Or, if you use nodemon for development:
   ```sh
   npx nodemon server.js
   ```

---

## API Endpoint Details

### `/api/auth/register`
**Description:** Registers a new user by creating a user account with the provided information.

**HTTP Method:** POST

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "buyer" // optional, defaults to "buyer"
}
```

**Success Response:**
```json
{
  "_id": "60c72b2f9b1e8c001c8e4b8a",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "buyer",
  "token": "JWT_TOKEN_HERE"
}
```

**Error Response:**
```json
{
  "message": "User already exists"
}
```

---

### `/api/auth/login`
**Description:** Authenticates a user and returns a JWT token.

**HTTP Method:** POST

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "_id": "60c72b2f9b1e8c001c8e4b8a",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "buyer",
  "avatar": "",
  "token": "JWT_TOKEN_HERE"
}
```

**Error Response:**
```json
{
  "message": "Invalid email or password"
}
```

---

### `/api/auth/wishlist` (Add to Wishlist)
**Description:** Add a product to the authenticated user's wishlist.

**HTTP Method:** POST

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "productId": "PRODUCT_ID"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "wishlist": ["PRODUCT_ID", ...]
}
```

**Error Response:**
```json
{
  "message": "Product already in wishlist"
}
```

---

### `/api/auth/wishlist/:productId` (Remove from Wishlist)
**Description:** Remove a product from the authenticated user's wishlist.

**HTTP Method:** DELETE

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Success Response:**
```json
{
  "success": true,
  "message": "Product removed from wishlist",
  "wishlist": []
}
```

**Error Response:**
```json
{
  "message": "User not found"
}
```

---

### `/api/auth/wishlist` (Get Wishlist)
**Description:** Get the authenticated user's wishlist.

**HTTP Method:** GET

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Success Response:**
```json
{
  "success": true,
  "wishlist": [
    {
      "_id": "PRODUCT_ID",
      "name": "Product Name",
      ...product fields...
    }
  ]
}
```

**Error Response:**
```json
{
  "message": "User not found"
}
```

---

### `/api/products` (Get All Products)
**Description:** Fetch a paginated list of all products, with optional filters and sorting.

**HTTP Method:** GET

**Query Parameters (optional):**
- `keyword` (string): Search keyword for product name
- `category` (string): Filter by category
- `subcategory` (string): Filter by subcategory
- `brand` (string): Filter by brand
- `isFeatured` (boolean): Only featured products
- `isNew` (boolean): Only new arrivals
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sort` (string): Sort by `price-asc`, `price-desc`, `newest`, `rating`
- `pageNumber` (number): Page number (default 1)
- `pageSize` (number): Items per page (default 12)

**Success Response:**
```json
{
  "products": [
    { "_id": "PRODUCT_ID", "name": "Product Name", ...product fields... }
  ],
  "page": 1,
  "pages": 5,
  "count": 60
}
```

**Error Response:**
```json
{
  "message": "Failed to fetch products"
}
```

---

### `/api/products/:id` (Get Product by ID)
**Description:** Fetch a single product by its ID.

**HTTP Method:** GET

**Success Response:**
```json
{
  "_id": "PRODUCT_ID",
  "name": "Product Name",
  ...product fields...
}
```

**Error Response:**
```json
{
  "message": "Product not found"
}
```

---

### `/api/products` (Create Product)
**Description:** Create a new product (seller only).

**HTTP Method:** POST

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "name": "Product Name",
  "brand": "Brand Name",
  "category": "Category",
  "subcategory": "Subcategory",
  "description": "Product description",
  "price": 1000,
  "salePrice": 900,
  "images": ["url1", "url2"],
  "sizes": [{"size": "M", "countInStock": 10}],
  "colors": ["red", "blue"],
  "featured": true
}
```

**Success Response:**
```json
{
  "_id": "PRODUCT_ID",
  "name": "Product Name",
  ...product fields...
}
```

**Error Response:**
```json
{
  "message": "Invalid user data"
}
```

---

### `/api/products/:id` (Update Product)
**Description:** Update an existing product (seller only).

**HTTP Method:** PUT

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:** (any updatable product fields)

**Success Response:**
```json
{
  "_id": "PRODUCT_ID",
  "name": "Updated Product Name",
  ...product fields...
}
```

**Error Response:**
```json
{
  "message": "Product not found"
}
```

---

### `/api/products/:id` (Delete Product)
**Description:** Delete a product (seller only).

**HTTP Method:** DELETE

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Success Response:**
```json
{
  "message": "Product removed"
}
```

**Error Response:**
```json
{
  "message": "Product not found"
}
```

---

### `/api/products/:id/reviews` (Add Review)
**Description:** Add a review to a product (authenticated users).

**HTTP Method:** POST

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

**Success Response:**
```json
{
  "message": "Review added"
}
```

**Error Response:**
```json
{
  "message": "Product already reviewed"
}
```

---

### `/api/products/seller/products` (Get Seller's Products)
**Description:** Get all products created by the authenticated seller.

**HTTP Method:** GET

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Success Response:**
```json
{
  "products": [
    { "_id": "PRODUCT_ID", "name": "Product Name", ...product fields... }
  ]
}
```

**Error Response:**
```json
{
  "message": "Error message"
}
```

---

### `/api/orders` (Create Order)
**Description:** Create a new order for the authenticated user.

**HTTP Method:** POST

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "orderItems": [
    {
      "product": "PRODUCT_ID",
      "qty": 2,
      "size": "M",
      "color": "red"
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "Razorpay",
  "itemsPrice": 2000,
  "shippingPrice": 100,
  "totalPrice": 2100
}
```

**Success Response:**
```json
{
  "_id": "ORDER_ID",
  "user": "USER_ID",
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "Razorpay",
  "itemsPrice": 2000,
  "shippingPrice": 100,
  "totalPrice": 2100,
  ...order fields...
}
```

**Error Response:**
```json
{
  "message": "Invalid order data"
}
```

---

### `/api/orders/myorders` (Get My Orders)
**Description:** Get all orders for the authenticated user.

**HTTP Method:** GET

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Success Response:**
```json
[
  { "_id": "ORDER_ID", ...order fields... }
]
```

---

### `/api/orders/seller` (Get Seller Orders)
**Description:** Get all orders for the authenticated seller.

**HTTP Method:** GET

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Success Response:**
```json
[
  { "_id": "ORDER_ID", ...order fields... }
]
```

---

### `/api/orders/:id` (Get Order by ID)
**Description:** Get a single order by its ID.

**HTTP Method:** GET

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Success Response:**
```json
{
  "_id": "ORDER_ID",
  ...order fields...
}
```

**Error Response:**
```json
{
  "message": "Order not found"
}
```

---

### `/api/orders/:id/pay` (Verify Payment)
**Description:** Verify a Razorpay payment for an order.

**HTTP Method:** PUT

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "razorpay_order_id": "order_xyz",
  "razorpay_payment_id": "pay_abc",
  "razorpay_signature": "signature_here"
}
```

**Success Response:**
```json
{
  "_id": "ORDER_ID",
  "isPaid": true,
  ...order fields...
}
```

**Error Response:**
```json
{
  "message": "Order not found"
}
```

---


**Success Response:**
```json
{
  "_id": "ORDER_ID",
  "status": "shipped",
  ...order fields...
}
```

**Error Response:**
```json
{
  "message": "Order not found"
}
```

---

### `/api/orders/create-payment` (Create Payment Intent)
**Description:** Create a Razorpay payment order for the given amount.

**HTTP Method:** POST

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "amount": 2100
}
```

**Success Response:**
```json
{
  "id": "razorpay_order_id",
  "amount": 2100,
  "currency": "INR",
  ...razorpay order fields...
}
```

**Error Response:**
```json
{
  "message": "Failed to initiate payment"
}
```

---

### `/api/upload` (Upload Product Images)
**Description:** Upload a product image to Cloudinary (seller only).

**HTTP Method:** POST

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `image`: The image file to upload

**Success Response:**
```json
{
  "url": "https://cloudinary.com/your-uploaded-image.jpg"
}
```

**Error Response:**
```json
{
  "message": "No file uploaded"
}
```

---

## Getting Started

You can now run both the client and server as described above. Make sure your backend server is running before using the frontend for full functionality.

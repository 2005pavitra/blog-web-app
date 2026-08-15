# Blog Web Application

A full-stack blog web application built by Pavitra Pandey. This platform allows users to read, create, edit, and interact with blog posts across various categories, featuring a secure authentication system, role-based access control, and a responsive user interface.

## Tech Stack

**Backend:**
- Node.js & Express.js (REST API)
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication via `httpOnly` cookies
- Cloudinary for image storage

**Frontend:**
- React 18 with Vite
- React Router v7 for client-side routing
- Tailwind CSS for styling
- Material-UI (MUI) components

## Features

**Backend (`/backend`):**
- Secure JWT authentication using `httpOnly` cookies
- Role-based access control (User and Admin roles)
- Cloudinary integration for blog and profile image uploads
- Full CRUD operations for blogs with categorizations (DSA, Development, AI/ML, Placements, Interviews, Internships, Career, College, Tutorials, Other)
- Commenting system with nested replies
- Like and unlike functionality for blogs
- User profiles with photo upload capabilities
- API rate limiting using `express-rate-limit`
- Security headers implemented with `helmet`
- Centralized error handling middleware
- Robust input validation

**Frontend (`/frontend`):**
- Responsive user interface built with TailwindCSS and MUI
- **Pages:** Registration, Login, Home (blog listing with search and filter), BlogDetails (including likes and comments), CreateBlog, EditBlog, UserDashboard, About, and Contact.

## Security Features

- **Secure Authentication:** `httpOnly` JWT cookies (preventing XSS attacks on tokens, no localStorage usage).
- **Role Escalation Prevention:** Public registration routes always assign the `user` role. Admins can only be created via a dedicated CLI script.
- **Rate Limiting:** Protects authentication endpoints against brute-force attacks.
- **HTTP Security Headers:** Implemented via Helmet to secure Express apps by setting various HTTP headers.
- **Data Integrity:** Strict input validation and sanitization.
- **Upload Restrictions:** File upload size and type limits enforced before cloud storage.
- **Credential Protection:** Cloudinary credentials and other secrets are securely managed.
- **CORS Configuration:** Controlled via environment variables.
- **Information Disclosure Prevention:** No secrets exposed in API responses or server logs.

## Authentication Flow

1. **Register/Login:** User submits credentials to the server.
2. **Server Validation:** Server validates input and verifies the password using bcrypt.
3. **Token Generation:** A JWT is created upon successful authentication.
4. **Cookie Assignment:** The JWT is sent back to the client inside an `httpOnly` cookie.
5. **Authenticated Requests:** The client's browser automatically sends the cookie with subsequent requests.
6. **Authorization:** Backend middleware verifies the JWT before executing protected controllers.

## Environment Variables

Create a `.env` file in both the backend and frontend directories based on the provided examples.

**Backend (`backend/.env`):**
```env
PORT=4000
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
SECRET_KEY=your-jwt-secret-min-32-chars
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:4000
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd blog-web-app
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env # Fill in the environment variables
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env # Set VITE_API_URL
   ```

4. **Create Admin User:**
   ```bash
   cd ../backend
   npm run seed:admin
   ```

5. **Start the Application:**
   Open two terminal windows/tabs:

   *Terminal 1 (Backend):*
   ```bash
   cd backend
   npm run dev
   ```

   *Terminal 2 (Frontend):*
   ```bash
   cd frontend
   npm run dev
   ```

## API Routes

- `POST /api/users/register` — Register a new user (name, email, password, phone)
- `POST /api/users/login` — Authenticate and login (email, password)
- `GET /api/users/logout` — Logout user (clears cookie)
- `GET /api/users/me` — Get current authenticated user details
- `GET /api/users/profile/:id` — View a user's profile
- `PUT /api/users/profile` — Update current user's profile
- `GET /api/blogs/allblogs` — Fetch all published blogs
- `GET /api/blogs/:id` — Fetch a single blog by ID
- `POST /api/blogs/create` — Create a new blog (Requires Auth)
- `PUT /api/blogs/update/:id` — Update an existing blog (Requires Auth + Ownership)
- `DELETE /api/blogs/delete/:id` — Delete a blog (Requires Auth + Ownership)
- `POST /api/blogs/like/:id` — Toggle like status on a blog (Requires Auth)
- `GET /api/comments/:blogId` — Retrieve comments for a specific blog
- `POST /api/comments/add` — Add a comment to a blog (Requires Auth)
- `PUT /api/comments/update/:commentId` — Update a comment (Requires Auth + Ownership)
- `DELETE /api/comments/delete/:commentId` — Delete a comment (Requires Auth + Ownership or Admin)
- `GET /api/health` — Application health check endpoint

## Folder Structure

```text
blog-web-app/
├── backend/
│   ├── controllers/      # Route controllers (logic)
│   ├── middlewares/      # Express middlewares (auth, validation)
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── utils/            # Helper functions (Cloudinary, etc.)
│   ├── index.js          # Entry point
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/   # Reusable React/MUI components
    │   ├── pages/        # Route page components
    │   ├── context/      # React context (Auth context)
    │   ├── assets/       # Static assets (images, styles)
    │   ├── App.jsx       # Main App component with Routing
    │   └── main.jsx      # Entry point
    ├── public/
    ├── index.html
    ├── tailwind.config.js
    ├── package.json
    └── .env
```

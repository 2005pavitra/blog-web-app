# Backend Interview Notes

**Candidate:** Pavitra Pandey  
**Target:** TCS Prime Technical Interview  
**Project:** Blog Application

---

## 1. Project Architecture
Our backend follows the **Express MVC (Model-View-Controller)** pattern adapted for an API-first approach. 
- **Routes (`/routes`)**: Define API endpoints and map them to specific controller functions.
- **Middleware (`/middleware`)**: Intercept requests to perform checks (auth, error handling, parsing).
- **Controllers (`/controller`)**: Contain the core business logic.
- **Models (`/models`)**: Define the Mongoose schemas and interact with MongoDB.
- **Utilities (`/utils`, `/jwt`, `/constants`)**: Helper functions, constants, and JWT token generation.
- **Scripts (`/scripts`)**: Standalone scripts like the admin seeder.

This separation of concerns makes the codebase modular, testable, and easier to scale.

## 2. Request-Response Lifecycle
When a client sends an HTTP request, it goes through the following lifecycle:
1. **Express App Receives Request**: The server listens on a designated port.
2. **Global Middleware Chain**: The request passes through `helmet` (security headers), `cors` (cross-origin access), `cookie-parser` (parsing cookies), `rateLimiter` (DDoS protection), and `express.json` (body parsing).
3. **Route Matching**: Express finds the matching route (e.g., `POST /api/users/login`).
4. **Route-Specific Middleware**: e.g., authentication checks.
5. **Controller**: Business logic is executed.
6. **MongoDB Query**: The controller queries the database using Mongoose.
7. **JSON Response**: A formatted JSON response is sent back to the client.

## 3. Authentication Flow
- **Register**: Validate input → Hash password using `bcrypt` → Create user (always forcing `role='user'`) → Generate JWT → Set an `httpOnly` cookie.
- **Login**: Validate input → Find user in DB → Compare password with `bcrypt.compare` → Generate JWT → Set `httpOnly` cookie.
- **Logout**: Call `clearCookie` with the exact options used during creation to invalidate the session.
- **Cookie-only Auth**: Tokens are never sent in the JSON body or stored in localStorage, mitigating Cross-Site Scripting (XSS) attacks.

## 4. JWT (JSON Web Tokens)
JWT is a stateless authentication standard.
- **Structure**: `Header` (algo type) . `Payload` (claims) . `Signature` (verification).
- **Payload**: Contains only `{ userId }`. We avoid storing PII (Personally Identifiable Information) in the token.
- **Signing**: Created using `jsonwebtoken` and a secret key stored in environment variables.
- **Expiry**: Set to 7 days to balance user convenience and security.
- **Verification**: The server uses the secret to verify the signature. If altered, the token is invalid.

## 5. Cookies
We store the JWT in cookies with specific security flags:
- **`httpOnly`**: Prevents client-side JavaScript from accessing the cookie, preventing XSS.
- **`secure`**: Ensures the cookie is only sent over HTTPS (in production).
- **`sameSite`**: Set to `'None'` in production (for cross-origin requests) and `'Lax'` in development.
- **`path`**: Set to `/` to make it accessible across all routes.
Using cookies over localStorage is a fundamental security decision for auth tokens.

## 6. Middleware
Middleware functions have access to the request (`req`), response (`res`), and the `next` middleware function.
- **`isAuthenticated`**: Extracts token from the cookie, verifies the JWT, fetches the user from DB, and attaches `req.user`. Rejects if invalid.
- **`optionalAuth`**: Similar to `isAuthenticated`, but simply proceeds without setting `req.user` if no token is found (useful for public blogs with personalized views).
- **`isAdmin`**: Checks if `req.user.role === 'admin'`.
- **`isAuthorOrAdmin`**: Helper to check if the current user owns a resource or is an admin.
- **`errorHandler`**: Catches errors from controllers and formats them.
- **`rateLimiter` & `helmet`**: Security middlewares.

## 7. Authentication vs Authorization
- **Authentication**: "Who are you?" (e.g., verifying identity via login/JWT).
- **Authorization**: "What are you allowed to do?" (e.g., an authenticated user trying to delete a blog they don't own). 
A user can be perfectly authenticated but unauthorized to perform an action.

## 8. Role-Based Access Control (RBAC)
We implement two roles: `user` and `admin`.
- **Admin Creation**: Admins can only be created via a CLI seed script run on the server (`/scripts`). The public API cannot create admins.
- **Permissions**: Admins can manage all blogs, delete any comment, and access analytics.

## 9. MongoDB/Mongoose Design
- **Schemas**: Defined for `User`, `Blog`, `Comment`.
- **References**: Using `ObjectId` to link Comments to Blogs and Users.
- **Indexes**: Compound indexes (e.g., `status` + `createdAt`) to speed up listing, and Text indexes for search.
- **Sparse Indexes**: Used for optional unique fields.
- **Pre-save Hooks**: E.g., updating the `updatedAt` timestamp automatically.
- **Security**: The password field has `select: false` so it is not accidentally returned in queries.

## 10. Cloudinary Upload Flow
1. **Temp Storage**: `express-fileupload` stores the image temporarily on the server.
2. **Validation**: Validate MIME type (images only) and size (e.g., max 5MB).
3. **Upload**: Use `cloudinary.uploader.upload(tempFilePath)`.
4. **Database Storage**: Store the resulting `public_id` and `url` in MongoDB.
5. **Cleanup**: Destroy the old asset on Cloudinary using `public_id` when an image is updated or a blog is deleted. Cloudinary credentials remain safely on the backend.

## 11. REST APIs
The backend follows RESTful principles:
- **Resource-Based URLs**: `/api/users`, `/api/blogs`, `/api/comments`.
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (remove).
- **Status Codes**: 
  - 200 (OK), 201 (Created)
  - 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
  - 409 (Conflict/Duplicate), 500 (Internal Server Error)
- **Response Format**: Consistent JSON structure (`{ success: true/false, data, message }`).

## 12. Error Handling
- **Centralized**: Uncaught errors are passed to the `errorHandler` middleware.
- **Mongoose Errors**: 
  - `ValidationError` -> mapped to 400.
  - `CastError` (invalid ObjectId) -> mapped to 400.
  - Code `11000` (Duplicate Key) -> mapped to 409.
  - JWT errors -> mapped to 401.
- **Stack Traces**: Hidden in production environments to prevent information leakage.

## 13. CORS (Cross-Origin Resource Sharing)
Needed because the frontend (Vite, e.g., port 5173) and backend (Express, e.g., port 4000) run on different origins.
- **Configuration**: The `origin` is set via an environment variable.
- **Credentials**: `credentials: true` must be set so the browser sends the `httpOnly` cookies with the requests.
- **Preflight**: Browsers send an `OPTIONS` request before complex cross-origin requests to check permissions.

## 14. Security Decisions
- **Helmet**: Secures HTTP headers.
- **Rate Limiting**: Protects against brute-force attacks and DDoS.
- **Validation**: Strict input validation to prevent NoSQL injection.
- **File Upload Limits**: Prevents denial of service via massive files.
- **Secrets Management**: Removed `.env` from git tracking, relying on environment variables.

## 15. Database Indexing
Indexes are B-tree structures that dramatically speed up read operations.
- **Blog Indexes**: 
  - `{ status: 1, createdAt: -1 }` (for main feed).
  - `{ category: 1, status: 1 }` (for filtering).
  - Text index on title/description (for search).
- **Bookmark Index**: `{ userId: 1, blogId: 1 }` compound unique index to prevent duplicate bookmarks.
- **Trade-off**: Indexes speed up reads but slow down writes and consume disk space.

## 16. Why MongoDB Was Chosen
- **Document-Oriented**: Fits blog content naturally (e.g., tags as arrays).
- **Flexibility**: Evolving schemas without massive migrations.
- **Node.js Integration**: Mongoose ODM works seamlessly with JS objects.
- **JSON-Native**: Easy data flow from DB to Backend to Frontend.
- **Hosting**: MongoDB Atlas provides excellent managed database services.

## 17. How to Scale
- **Read Replicas**: To handle high read traffic (common in blogs).
- **Caching**: Implement Redis for frequently accessed blogs.
- **CDN**: Cloudinary already acts as a CDN for images.
- **Load Balancing**: Run multiple Node.js instances behind an Nginx or AWS ALB load balancer.
- **Database Sharding**: Partitioning data by date or category as data grows.
- **Background Jobs**: Offloading heavy tasks (like bulk emails or analytics) to worker queues (e.g., BullMQ).

---

## Phase 1 Major Fixes (Audited & Resolved)

### 1. Role Escalation Vulnerability
- **What was wrong?** The registration endpoint blindly accepted the `role` field from the client's request body (`req.body`).
- **Why was it wrong?** A malicious user could intercept the request and send `{"role": "admin"}` to grant themselves administrative privileges.
- **How was it fixed?** The registration controller was updated to hardcode `role: 'user'` during user creation. Admins are now only created via a secure backend seed script.
- **Why this solution?** It enforces the principle of least privilege at the API boundary.
- **What alternatives exist?** Using a separate, highly protected API endpoint for creating admins, protected by a super-admin API key.
- **What could go wrong in production?** If the seed script fails or credentials are lost, creating the initial admin becomes difficult.

### 2. JWT Security & LocalStorage Leak
- **What was wrong?** JWT tokens were being sent in the JSON response body and potentially stored in localStorage by the frontend.
- **Why was it wrong?** LocalStorage is accessible to any JavaScript running on the page, making the app highly vulnerable to Cross-Site Scripting (XSS) attacks stealing tokens.
- **How was it fixed?** The backend was refactored to set the JWT exclusively in an `httpOnly` cookie. The token was removed from the JSON response body.
- **Why this solution?** `httpOnly` cookies cannot be read by `document.cookie`, neutralizing XSS token theft.
- **What alternatives exist?** Keeping token in memory (React state) and using silent refresh mechanisms with refresh tokens (more complex).
- **What could go wrong in production?** If CORS and cookie `sameSite` settings aren't configured perfectly across domains, cookies won't be sent, breaking authentication.

### 3. CORS and Cookie Misconfiguration
- **What was wrong?** CORS was misconfigured, and cookies were lacking strict cross-origin policies.
- **Why was it wrong?** The frontend couldn't communicate with the backend, or cookies wouldn't attach because credentials weren't explicitly allowed.
- **How was it fixed?** Configured `cors({ origin: process.env.FRONTEND_URL, credentials: true })`. Adjusted cookie flags based on environment: `sameSite: 'None', secure: true` for production, `sameSite: 'Lax'` for dev.
- **Why this solution?** Browsers require these exact headers and flags to securely pass cookies across origins.
- **What alternatives exist?** Hosting frontend and backend on the exact same domain (e.g., using a reverse proxy like Nginx), which simplifies cookie policies.
- **What could go wrong in production?** If the `FRONTEND_URL` env variable is missing or wrong, the entire application frontend will fail to connect.

### 4. Database Connection Refactoring
- **What was wrong?** MongoDB connection logic was scattered or not handling failures gracefully.
- **Why was it wrong?** A failed DB connection would crash the app unexpectedly, or the app would start accepting requests before the DB was ready.
- **How was it fixed?** Centralized DB connection in a robust async function in a dedicated file, implemented process exiting `process.exit(1)` on fatal DB errors.
- **Why this solution?** Fail-fast philosophy. It's better for the server to crash and let a process manager (like PM2 or Docker) restart it than to run in a broken state.
- **What alternatives exist?** Implementing connection retries with exponential backoff before crashing.
- **What could go wrong in production?** If the DB goes down temporarily, the app crashes and requires the orchestrator to restart it properly.

### 5. Dead Code & Unused Routes
- **What was wrong?** There were leftover controllers and routes (like test endpoints or deprecated functions).
- **Why was it wrong?** Dead code increases the attack surface, confuses maintainers, and bloats the codebase.
- **How was it fixed?** Audited and removed all unused routes, controllers, and obsolete dependencies.
- **Why this solution?** Clean code principles dictate that unused code should be deleted (version control keeps a history anyway).
- **What alternatives exist?** Commenting out code (bad practice) or hiding behind feature flags.
- **What could go wrong in production?** Accidentally deleting a route that a legacy mobile app or un-updated frontend still relies on.

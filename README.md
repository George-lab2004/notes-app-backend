# Notes App — Fullstack REST API

A fullstack notes application with user authentication, email verification, and ownership-protected CRUD operations.

**Live API:** https://notes-app-backend-six-gamma.vercel.app  
**Frontend:** https://notes-app-backend-p3wd.vercel.app

---

## Tech Stack

**Backend:** Node.js · Express 5 · MongoDB · Mongoose  
**Auth:** JWT · Bcrypt  
**Validation:** Joi  
**Email:** Nodemailer (Gmail)  
**Deployment:** Vercel + MongoDB Atlas

---

## Features

- User registration with email verification
- Secure sign in with JWT (1hr expiry)
- Password hashing with Bcrypt
- Input validation on every route
- Private notes — each user only sees their own
- Ownership check on update and delete (403 if not owner)
- Environment variables for all secrets

---

## API Endpoints

### Auth — `/users`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/signUp` | Register new user | ❌ |
| POST | `/users/signIn` | Sign in, returns JWT | ❌ |
| GET | `/verify/:email` | Verify email from link | ❌ |

**Sign Up body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "refPassword": "Password123",
  "age": 25
}
```

**Sign In body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Sign In response:**
```json
{
  "message": "success",
  "token": "<jwt_token>",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

### Notes — `/notes`

All notes routes require `token` header from sign in.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/notes` | Create a note | ✅ |
| GET | `/notes` | Get all your notes | ✅ |
| GET | `/notes/:id` | Get one note | ✅ |
| PUT | `/notes/:id` | Update your note | ✅ |
| DELETE | `/notes/:id` | Delete your note | ✅ |

**Create / Update note body:**
```json
{
  "title": "My Note",
  "content": "Note content here"
}
```

**Headers (protected routes):**
```
token: <your_jwt_token>
```

---

## Run Locally

```bash
# Clone
git clone https://github.com/George-lab2004/notes-app-backend.git
cd notes-app-backend

# Install
npm install

# Create .env (see .env.example)
cp .env.example .env

# Start
npm run dev
```

**.env setup:**
```
PORT=3000
BACKEND_URL=http://localhost:3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Your Name
```

---

## Project Structure

```
├── index.js              # Entry point
├── db/dbConnection.js    # MongoDB connection
├── models/               # Mongoose schemas (User, Note)
└── src/
    ├── Middleware/        # verifyToken, validate, checkEmail
    ├── emails/            # Nodemailer + HTML template
    └── modules/
        ├── users/         # Auth controller, routes, validation
        └── notes/         # Notes controller, routes, validation
```

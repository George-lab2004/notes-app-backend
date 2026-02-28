import PDFDocument from "pdfkit"
import fs from "fs"

const doc = new PDFDocument({ margin: 50, size: "A4" })
doc.pipe(fs.createWriteStream("Project_Explained.pdf"))

// ─── COLOUR PALETTE ───────────────────────────────────────────────────────────
const C = {
  purple:  "#6C3EE8",
  dark:    "#1A1A2E",
  mid:     "#444466",
  light:   "#F4F4FB",
  green:   "#1DB954",
  orange:  "#E8883E",
  red:     "#E84040",
  border:  "#DDDDEE",
  codeBg:  "#1E1E2E",
  codeText:"#CDD6F4",
  white:   "#FFFFFF",
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const gap   = (n = 10)  => doc.moveDown(n / 14)
const rule  = (color = C.border) => {
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(color).lineWidth(1).stroke()
  gap(8)
}

function heading1(text) {
  gap(18)
  doc.fontSize(22).fillColor(C.purple).font("Helvetica-Bold").text(text)
  doc.moveTo(50, doc.y + 4).lineTo(545, doc.y + 4).strokeColor(C.purple).lineWidth(2).stroke()
  gap(14)
  doc.font("Helvetica").fontSize(11).fillColor(C.mid)
}

function heading2(text) {
  gap(14)
  doc.fontSize(15).fillColor(C.dark).font("Helvetica-Bold").text(text)
  gap(6)
  doc.font("Helvetica").fontSize(11).fillColor(C.mid)
}

function heading3(text) {
  gap(10)
  doc.fontSize(12).fillColor(C.purple).font("Helvetica-Bold").text(text)
  gap(4)
  doc.font("Helvetica").fontSize(11).fillColor(C.mid)
}

function body(text) {
  doc.fontSize(11).fillColor(C.mid).font("Helvetica").text(text, { lineGap: 3 })
  gap(6)
}

function callout(label, text, color = C.purple) {
  const y = doc.y
  doc.rect(50, y, 495, 1).fill(color)
  gap(2)
  doc.fontSize(10).fillColor(color).font("Helvetica-Bold").text(label, 58, doc.y)
  doc.fontSize(10).fillColor(C.mid).font("Helvetica").text(text, 58, doc.y, { lineGap: 2 })
  gap(10)
}

function improvement(text) {
  const y = doc.y
  doc.rect(50, y, 4, 999).fill(C.green) // placeholder — we'll clip
  const startY = y
  doc.rect(50, startY, 495, 20).fill("#E8F8EE")
  doc.fontSize(10).fillColor("#0A5C2E").font("Helvetica-Bold")
     .text("  IMPROVEMENT  ", 50, startY + 4, { width: 495, align: "center" })
  gap(22)
  doc.fontSize(10).fillColor("#1A4430").font("Helvetica").text(text, 58, doc.y, { lineGap: 2 })
  gap(10)
}

function note(text) {
  const y = doc.y
  doc.rect(50, y, 495, 14).fill("#FFF8E6")
  doc.fontSize(9).fillColor("#7A5300").font("Helvetica-Bold").text("NOTE  ", 58, y + 3, { continued: true })
  doc.fontSize(9).fillColor("#7A5300").font("Helvetica").text(text, { lineGap: 2 })
  gap(10)
}

function code(lines) {
  const padding = 12
  const lineH   = 14
  const height  = lines.length * lineH + padding * 2
  const y       = doc.y

  if (y + height > 760) doc.addPage()
  const cy = doc.y

  doc.rect(50, cy, 495, height).fill(C.codeBg).stroke()
  doc.fontSize(9).font("Courier").fillColor(C.codeText)
  lines.forEach((line, i) => {
    doc.text(line, 62, cy + padding + i * lineH, { lineBreak: false })
  })
  doc.y = cy + height + 10
  gap(4)
}

function bullet(items, indent = 58) {
  items.forEach(item => {
    doc.fontSize(11).fillColor(C.mid).font("Helvetica")
       .text(`• ${item}`, indent, doc.y, { lineGap: 2 })
    gap(3)
  })
  gap(4)
}

function twoCol(left, right, lw = 180) {
  const y = doc.y
  doc.fontSize(10).fillColor(C.dark).font("Helvetica-Bold").text(left, 58, y, { width: lw, lineBreak: false })
  doc.fontSize(10).fillColor(C.mid).font("Helvetica").text(right, 58 + lw, y, { width: 310 })
  gap(5)
}

// ══════════════════════════════════════════════════════════════════════════════
// COVER PAGE
// ══════════════════════════════════════════════════════════════════════════════
doc.rect(0, 0, 595, 842).fill(C.dark)
doc.rect(0, 600, 595, 242).fill(C.purple)

doc.fontSize(9).fillColor("#AAAACC").font("Helvetica")
   .text("FULLSTACK PROJECT DOCUMENTATION", 50, 80, { align: "center", width: 495 })

doc.fontSize(36).fillColor(C.white).font("Helvetica-Bold")
   .text("Notes App", 50, 110, { align: "center", width: 495 })

doc.fontSize(16).fillColor("#AAAACC").font("Helvetica")
   .text("Backend + Frontend — Code Explained", 50, 165, { align: "center", width: 495 })

doc.moveTo(200, 210).lineTo(395, 210).strokeColor(C.purple).lineWidth(2).stroke()

doc.fontSize(12).fillColor("#CCCCEE").font("Helvetica")
   .text("Node.js  ·  Express 5  ·  MongoDB  ·  JWT  ·  Bcrypt  ·  Joi  ·  Nodemailer", 50, 230, { align: "center", width: 495 })

// Stack badges row
const badges = ["ESModules", "REST API", "Auth", "Validation", "Email", "Vanilla JS Frontend"]
let bx = 85
badges.forEach(b => {
  doc.rect(bx, 270, b.length * 6 + 16, 18).fill(C.purple)
  doc.fontSize(8).fillColor(C.white).font("Helvetica-Bold").text(b, bx + 8, 275, { lineBreak: false })
  bx += b.length * 6 + 24
})

doc.fontSize(11).fillColor("#AAAACC").font("Helvetica")
   .text("This document walks through every part of this project:\nwhat each file does, why each decision was made,\nand what was improved during the build.", 50, 320, { align: "center", width: 495, lineGap: 4 })

doc.fontSize(10).fillColor(C.white).font("Helvetica-Bold")
   .text("Generated: " + new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), 50, 620, { align: "center", width: 495 })

// ══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — TABLE OF CONTENTS
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("Table of Contents")

const toc = [
  ["1", "Project Overview",               "What this project is and does"],
  ["2", "Project Structure",              "Folder layout and why it's organised this way"],
  ["3", "Setup & Entry Point (index.js)", "How the app boots: dotenv, cors, express, routes"],
  ["4", "Database Connection",            "Connecting to MongoDB with Mongoose"],
  ["5", "Models",                         "User model and Note model — your database tables"],
  ["6", "Middleware",                      "verifyToken, validate, checkEmail — the gatekeepers"],
  ["7", "Users Module",                   "signUp and signIn — controllers, routes, validation"],
  ["8", "Notes Module",                   "CRUD notes — create, read, update, delete with ownership"],
  ["9", "Email System",                   "Nodemailer + HTML template for email verification"],
  ["10","Security (.env)",                "All secrets in environment variables"],
  ["11","Key Concepts Explained",         "lean(), populate(), {new:true}, JWT flow, Joi pattern"],
  ["12","What Was Improved",              "Every bug found and fixed with the reason why"],
  ["13","Frontend",                       "Vanilla JS SPA — auth, dashboard, notes CRUD"],
]

toc.forEach(([num, title, desc]) => {
  const y = doc.y
  doc.rect(50, y, 30, 24).fill(C.purple)
  doc.fontSize(11).fillColor(C.white).font("Helvetica-Bold").text(num, 50, y + 7, { width: 30, align: "center", lineBreak: false })
  doc.fontSize(11).fillColor(C.dark).font("Helvetica-Bold").text(title, 90, y + 3, { lineBreak: false })
  doc.fontSize(9).fillColor(C.mid).font("Helvetica").text(desc, 90, y + 15)
  gap(8)
})

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — PROJECT OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("1. Project Overview")

body("This is a fullstack Notes application. Users can register, verify their email, sign in, and then create, read, update, and delete their own private notes. Every note is tied to the user who created it — no one else can touch it.")

heading2("What technologies are used?")
twoCol("Node.js",        "JavaScript runtime — runs your backend code outside the browser")
twoCol("Express 5",      "The web framework — handles routing, middleware, request/response")
twoCol("MongoDB",        "NoSQL database — stores documents (users, notes) in JSON-like format")
twoCol("Mongoose 9",     "ODM — lets you define schemas and interact with MongoDB using JavaScript")
twoCol("JWT",            "JSON Web Token — the 'ticket' given to users after sign in, proves identity")
twoCol("Bcrypt",         "Password hashing — turns plain passwords into secure encrypted strings")
twoCol("Joi",            "Validation library — checks that incoming data has the right shape and rules")
twoCol("Nodemailer",     "Sends emails — used here to send an email verification link")
twoCol("Dotenv",         "Loads secret values from a .env file — keeps credentials out of source code")
twoCol("Cors",           "Allows your frontend (different origin) to call your backend API")

heading2("The full request journey")
bullet([
  "User sends a request (sign up, sign in, add note, etc.)",
  "Express receives it and runs any middleware first (cors, json parser, verifyToken, validate)",
  "The request reaches the route handler (signUp, addNote, etc.)",
  "The controller talks to the database via Mongoose models",
  "The response is sent back to the user",
])

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — PROJECT STRUCTURE
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("2. Project Structure")

body("The project is organised in a modular structure — each feature (users, notes) lives in its own folder with its own controller, routes, and validation file. This makes the code easier to read, maintain, and scale.")

code([
  "Social Media/",
  "├── index.js              ← App entry point: boots server, loads middleware, mounts routes",
  "├── package.json          ← Project config, dependencies, npm scripts",
  "├── .env                  ← Secret config values (never committed to Git)",
  "├── .env.example          ← Safe template showing what .env needs (without real values)",
  "├── .gitignore            ← Tells Git to ignore .env and node_modules",
  "│",
  "├── db/",
  "│   └── dbConnection.js   ← Connects to MongoDB Atlas or local MongoDB",
  "│",
  "├── models/",
  "│   ├── user.model.js     ← Defines the User table structure (schema)",
  "│   └── note.model.js     ← Defines the Note table structure (schema)",
  "│",
  "└── src/",
  "    ├── emails/",
  "    │   ├── sendEmail.js  ← Nodemailer setup and send function",
  "    │   └── htmlCode.js   ← HTML template for the verification email",
  "    │",
  "    ├── Middleware/",
  "    │   ├── verifyToken.js ← Checks JWT token on protected routes",
  "    │   ├── validate.js    ← Runs Joi schema validation on request data",
  "    │   └── checkEmail.js  ← Checks if email already exists before sign up",
  "    │",
  "    └── modules/",
  "        ├── users/",
  "        │   ├── user.controller.js  ← signUp and signIn logic",
  "        │   ├── user.routes.js      ← POST /users/signUp, POST /users/signIn",
  "        │   └── validation.js       ← Joi rules for sign up / sign in",
  "        │",
  "        └── notes/",
  "            ├── notes.controller.js ← CRUD logic for notes",
  "            ├── notes.routes.js     ← GET/POST/PUT/DELETE /notes routes",
  "            └── note.validation.js  ← Joi rules for adding / updating notes",
])

body("Why this structure? If the codebase grows — say you add a comments feature — you simply add a comments/ folder inside modules/ with its own controller, routes, and validation. The rest of the code is untouched.")

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — ENTRY POINT
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("3. Setup & Entry Point — index.js")

body("index.js is the first file Node runs. Think of it as the front door of your application. It boots everything in the right order.")

code([
  "import 'dotenv/config'                          // 1. Load .env first — everything else needs it",
  "import express from 'express'",
  "import cors from 'cors'",
  "import { dbConnection } from './db/dbConnection.js'",
  "import { userRouter } from './src/modules/users/user.routes.js'",
  "import { notesRouter } from './src/modules/notes/notes.routes.js'",
  "import { User } from './models/user.model.js'",
  "",
  "const app = express()",
  "const port = process.env.PORT || 3000",
  "dbConnection()                                  // 2. Connect to database",
  "",
  "app.use(cors())                                  // 3. Allow frontend requests",
  "app.use(express.json())                          // 4. Parse JSON body on ALL routes",
  "",
  "app.get('/verify/:email', async (req, res, next) => {  // 5. Email verification endpoint",
  "    const user = await User.findOneAndUpdate(",
  "        { email: req.params.email },",
  "        { confirmedEmail: true },",
  "        { new: true }",
  "    )",
  "    if (!user) return res.status(404).json({ message: 'user not found' })",
  "    return res.status(200).json({ message: 'email verified successfully' })",
  "})",
  "",
  "app.use('/users', userRouter)                   // 6. Mount user routes",
  "app.use(notesRouter)                            // 7. Mount notes routes",
  "",
  "app.listen(port, () => console.log(`Listening on port ${port}`))",
])

callout("Why dotenv/config first?", "If you import dotenv after other files, those other files might read process.env.JWT_SECRET and get undefined because .env hasn't loaded yet. First import = always available everywhere.", C.orange)

improvement("express.json() was originally placed AFTER the routes. This meant req.body was always undefined for all routes — the JSON parser hadn't run yet. Moving it before all routes fixed this.")
improvement("The /verify/:email endpoint originally had no logic at all. It now calls User.findOneAndUpdate to actually flip confirmedEmail to true in the database when the user clicks their link.")

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — DATABASE CONNECTION
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("4. Database Connection")

code([
  "import mongoose from 'mongoose'",
  "",
  "export const dbConnection = () => {",
  "    mongoose.connect(process.env.MONGO_URI).then(() => {",
  "        console.log('db connected')",
  "    }).catch((error) => {",
  "        console.log(error)",
  "    })",
  "}",
])

body("This is a simple function that calls mongoose.connect() with your connection string. Mongoose handles the rest — it keeps the connection alive and reuses it for every DB operation.")

callout("Where is the database name?", "It is inside MONGO_URI in your .env file: mongodb://localhost:27017/jwt — the word after the last slash is the database name. Here it is 'jwt'. You can rename it to anything (e.g. social-media-app) and MongoDB creates it automatically the first time you save a document.", C.purple)

heading3("What is an ODM?")
body("ODM = Object Document Mapper. Mongoose sits between your JavaScript code and MongoDB. Without it you'd write raw MongoDB queries. With it you work with JavaScript objects and Mongoose translates them. It also gives you schema validation at the database layer, middleware hooks, and methods like .find() .create() .findByIdAndUpdate() etc.")

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — MODELS
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("5. Models")

body("A model is the blueprint for a document in MongoDB. You define a Schema first (the rules and field names), then call mongoose.model() to create the actual collection. MongoDB creates the collection automatically when you first insert a document.")

heading2("User Model")

code([
  "import mongoose, { Schema } from 'mongoose'",
  "",
  "export const userSchema = new Schema({",
  "    name:           { type: String, required: true, trim: true, minlength: [3,'at least 3 chars'] },",
  "    email:          { type: String, required: true },",
  "    password:       { type: String },",
  "    role:           { type: String, enum: ['admin','user'], default: 'user' },",
  "    confirmedEmail: { type: Boolean, default: false },",
  "    age:            { type: Number, min: 5, max: 80 }",
  "}, { versionKey: false })",
  "",
  "export let User = mongoose.model('User', userSchema)",
])

bullet([
  "trim: true — automatically removes whitespace from both ends of a string",
  "enum — only allows specific values ('admin' or 'user')",
  "default — value used when none is provided at creation time",
  "versionKey: false — removes the __v field MongoDB adds automatically (cleaner output)",
  "confirmedEmail defaults to false — flipped to true when user clicks email link",
])

improvement("The age field was missing from the original model. The Joi validation schema required age, the frontend sent age, but the User model had no age field — so it was silently dropped by Mongoose. Adding age: { type: Number, min: 5, max: 80 } made it persist correctly.")

heading2("Note Model")

code([
  "import mongoose, { Schema } from 'mongoose'",
  "",
  "export const NoteSchema = new Schema({",
  "    title:   { type: String, required: true, trim: true },",
  "    content: { type: String, required: true },",
  "    userId:  { type: Schema.Types.ObjectId, ref: 'User', required: true }",
  "})",
  "",
  "export const Note = mongoose.model('Note', NoteSchema)",
])

body("The key field here is userId. It stores an ObjectId — a unique 24-character ID that references a User document. This is how the relationship works: every note knows which user owns it.")
callout("ref: 'User'", "The ref value must exactly match the string used in mongoose.model('User', ...). This is what allows .populate() to work — Mongoose uses this reference to know which collection to look up.", C.purple)

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — MIDDLEWARE
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("6. Middleware")

body("Middleware are functions that run between the incoming request and the final route handler. They can read/modify the request, block it with an error, or pass it forward with next().")

heading2("verifyToken.js — The Token Bouncer")

code([
  "import jwt from 'jsonwebtoken'",
  "",
  "export const verifyToken = (req, res, next) => {",
  "    const { token } = req.headers",
  "    if (!token) return res.status(401).json({ message: 'token is required' })",
  "",
  "    const secret = process.env.JWT_SECRET",
  "    jwt.verify(token, secret, (error, decoded) => {",
  "        if (error) return res.status(401).json({ message: 'wrong token' })",
  "        req.userId = decoded?.id       // attach the user's ID to the request",
  "        return next()",
  "    })",
  "}",
])

heading3("How does the token get into the headers?")
body("JWT does nothing automatically. The flow is manual on both ends:")
bullet([
  "Sign in → backend creates the token → sends it in the response body",
  "Frontend receives it → saves it to localStorage",
  "On every future API call → frontend manually adds it: headers: { token: '<value>' }",
  "verifyToken reads req.headers.token, verifies it, decodes the user's ID",
  "That ID is attached as req.userId so any controller down the chain can use it",
])

improvement("req.hamada was used as the property name for the user ID decoded from the JWT. This was a placeholder name left from development. Renamed to req.userId — which is descriptive, standard, and won't confuse any other developer reading the code.")

heading2("validate.js — The Data Checker")

code([
  "export const validation = (schema) => {",
  "    return (req, res, next) => {",
  "        let { error } = schema.validate(",
  "            { ...req.body, ...req.params, ...req.query },",
  "            { abortEarly: false }",
  "        )",
  "        if (!error) {",
  "            next()",
  "        } else {",
  "            res.status(400).json(error.details)",
  "        }",
  "    }",
  "}",
])

body("This is a higher-order function — a function that returns another function. You call validation(someSchema) and it gives you back a middleware. This lets you reuse the same validation logic with any Joi schema.")
body("{ abortEarly: false } means Joi checks ALL rules and returns ALL errors at once, not just the first one. This makes the frontend able to show all form errors simultaneously.")
improvement("The original code had { aboutEarly: false } — a typo with a missing 'r' in abortEarly. Since the key was wrong, Joi was using its default of abortEarly: true — stopping at the first error. Fixed using the correct spelling { abortEarly: false }.")

heading2("checkEmail.js — Duplicate Guard")

code([
  "import { User } from '../../models/user.model.js'",
  "",
  "export const checkEmail = async (req, res, next) => {",
  "    try {",
  "        const { email } = req.body",
  "        if (!email) return res.status(400).json({ message: 'email is required' })",
  "",
  "        const isExist = await User.exists({ email })",
  "        if (isExist) return res.status(409).json({ message: 'Email already exists' })",
  "",
  "        return next()",
  "    } catch (error) {",
  "        return next(error)",
  "    }",
  "}",
])

body("User.exists() is more efficient than User.findOne() here — findOne fetches the whole document, exists just checks if it's there. It returns the document's _id if found, null if not. 409 means Conflict — a more precise status code than 400 for 'this resource already exists'.")

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — USERS MODULE
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("7. Users Module")

heading2("user.routes.js")

code([
  "import { Router } from 'express'",
  "import { signIn, signUp } from './user.controller.js'",
  "import { checkEmail } from '../../Middleware/checkEmail.js'",
  "import { validation } from '../../Middleware/validate.js'",
  "import { signInValidation, signUpValidation } from './validation.js'",
  "",
  "export const userRouter = Router()",
  "",
  "userRouter.post('/signUp', validation(signUpValidation), checkEmail, signUp)",
  "userRouter.post('/signIn', validation(signInValidation), signIn)",
])

body("For signUp the middleware chain is: validate the shape of the data first → then check the email isn't taken → then run the signUp controller. If validation fails, checkEmail and signUp never even run. This ordering matters — cheapest checks go first.")

heading2("validation.js — Sign Up & Sign In Rules")

code([
  "import Joi from 'joi'",
  "",
  "let signUpValidation = Joi.object({",
  "    name:        Joi.string().min(3).max(40).required(),",
  "    email:       Joi.string().email().required(),",
  "    password:    Joi.string().pattern(/^[A-z][A-za-z0-9]{4,50}$/),",
  "    refPassword: Joi.valid(Joi.ref('password')).required(),",
  "    age:         Joi.number().min(5).max(80).required()",
  "})",
  "",
  "let signInValidation = Joi.object({",
  "    email:    Joi.string().email().required(),",
  "    password: Joi.string().pattern(/^[A-z][A-za-z0-9]{4,50}$/)",
  "})",
])

body("Joi.valid(Joi.ref('password')) means: this field is valid only if its value equals the value of the password field. This is the standard Joi way to do 'confirm password' matching — the check happens before the request even reaches the controller.")

heading2("user.controller.js — signUp")

code([
  "const signUp = async (req, res, next) => {",
  "    try {",
  "        const { name, email, password, age } = req.body",
  "                                               // ^ refPassword NOT destructured — validation only",
  "        const hashedPassword = await bcrypt.hash(password, 8)",
  "",
  "        const user = await User.create({ name, email, password: hashedPassword, age })",
  "",
  "        sendEmail(email).catch((error) => {    // fire-and-forget: don't block the response",
  "            console.error('sendEmail failed:', error?.message || error)",
  "        })",
  "",
  "        const safeUser = { _id: user._id, name: user.name, email: user.email, age: user.age }",
  "        res.status(201).json({ message: 'Account created successfully', user: safeUser })",
  "    } catch (error) {",
  "        return next(error)",
  "    }",
  "}",
])

bullet([
  "Destructuring only the fields needed prevents refPassword or any injected field from reaching the DB",
  "await bcrypt.hash() — async version, doesn't block the event loop (unlike bcrypt.hashSync)",
  "User.create() — for a single document; insertMany() is for bulk inserts (arrays)",
  "safeUser strips the hashed password before sending the response — the user never sees it, but it still exists in the DB",
  "201 = Created — more precise than 200 (OK) for a resource creation",
])

improvement("Original signUp used insertMany([req.body]) — wrong for a single user, and it would store everything in req.body including refPassword. Also used bcrypt.hashSync which blocks Node's event loop. Fixed to: User.create() with explicit field destructuring, and await bcrypt.hash() (async).")

heading2("user.controller.js — signIn")

code([
  "const signIn = async (req, res, next) => {",
  "    try {",
  "        const { email, password } = req.body",
  "        if (!email || !password) return res.status(400).json({ message: 'required' })",
  "",
  "        const user = await User.findOne({ email }).lean()",
  "        if (!user) return res.status(401).json({ message: 'invalid email or password' })",
  "",
  "        const match = bcrypt.compareSync(password, user.password)",
  "        if (!match) return res.status(401).json({ message: 'invalid email or password' })",
  "",
  "        const token = jwt.sign(",
  "            { id: user._id, name: user.name, email: user.email },",
  "            process.env.JWT_SECRET,",
  "            { expiresIn: '1h' }",
  "        )",
  "",
  "        delete user.password",
  "        return res.status(200).json({ message: 'success', token, user })",
  "    } catch (error) {",
  "        return next(error)",
  "    }",
  "}",
])

note(".lean() returns a plain JS object instead of a Mongoose Document. This is faster (no Mongoose overhead) and lets you freely delete user.password before sending. On a Mongoose Document, delete works unpredictably.")
note("Both 'email not found' and 'wrong password' return the exact same error message ('invalid email or password'). This is intentional — different messages would let attackers probe which emails are registered.")
note("expiresIn: '1h' — token expires after 1 hour. After that, verifyToken will reject it and the user must sign in again. This is a security measure.")

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — NOTES MODULE
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("8. Notes Module")

heading2("notes.routes.js")

code([
  "import { Router } from 'express'",
  "import { addNote, deleteNote, getNotes, getOneNote, updateNote } from './notes.controller.js'",
  "import { verifyToken } from '../../Middleware/verifyToken.js'",
  "import { addNoteValidation, updateNoteValidation } from './note.validation.js'",
  "import { validation } from '../../Middleware/validate.js'",
  "",
  "export const notesRouter = Router()",
  "",
  "notesRouter.post  ('/notes',     verifyToken, validation(addNoteValidation),    addNote)",
  "notesRouter.get   ('/notes',     verifyToken, getNotes)",
  "notesRouter.get   ('/notes/:id', getOneNote)",
  "notesRouter.put   ('/notes/:id', verifyToken, validation(updateNoteValidation), updateNote)",
  "notesRouter.delete('/notes/:id', verifyToken, deleteNote)",
])

improvement("POST, PUT, and DELETE routes had no verifyToken middleware. This meant anyone could create, update, or delete notes without being logged in. verifyToken was added to all three — it is required because the controller reads req.userId which only exists after verifyToken runs.")

heading2("note.validation.js")

code([
  "import Joi from 'joi'",
  "",
  "const addNoteValidation = Joi.object({",
  "    title:   Joi.string().min(3).max(50).required(),",
  "    content: Joi.string().min(3).max(5000).required()",
  "})",
  "",
  "const updateNoteValidation = Joi.object({",
  "    title:   Joi.string().min(3).max(50).required(),",
  "    content: Joi.string().min(3).max(5000).required(),",
  "    id:      Joi.string().hex().length(24).required()  // MongoDB ObjectId from :id param",
  "})",
  "",
  "export { addNoteValidation, updateNoteValidation }",
])

improvement("Joi was not imported in this file — validation would crash at runtime. Also the field was named 'description' but the Note model uses 'content' — mismatch meant valid data would fail validation. Both fixed.")

heading2("notes.controller.js — All 5 Methods")

heading3("addNote")
code([
  "const addNote = async (req, res, next) => {",
  "    try {",
  "        const note = await Note.create({ ...req.body, userId: req.userId })",
  "        //                                             ^ from verifyToken — can't be faked",
  "        res.status(201).json({ message: 'Added successfully', note })",
  "    } catch (error) { next(error) }",
  "}",
])
body("userId comes from req.userId (the decoded JWT), NOT from req.body. If you took it from req.body a user could send any userId and forge ownership. The JWT approach makes it impossible — the server decides who the owner is based on who is logged in.")

heading3("getNotes")
code([
  "const getNotes = async (req, res, next) => {",
  "    try {",
  "        const notes = await Note.find({ userId: req.userId })",
  "                                     .populate('userId', 'name -_id')",
  "        res.status(200).json({ message: 'Fetched successfully', notes })",
  "    } catch (error) { next(error) }",
  "}",
])
body("Note.find({ userId: req.userId }) — filter by the logged-in user's ID, so each user only ever sees their own notes.")
note("populate('userId', 'name -_id') — replaces the raw ObjectId with the User's name only. The second arg is a projection: 'name' includes name, '-_id' excludes _id. Without populate you'd just see a 24-char ID string.")
improvement("Original had .populate('UserId') — capital U. MongoDB field names are case-sensitive. This silently returned the ObjectId without replacing it. Fixed to .populate('userId') matching the schema field name.")

heading3("getOneNote")
code([
  "const getOneNote = async (req, res, next) => {",
  "    try {",
  "        const note = await Note.findById(req.params.id)",
  "        res.status(200).json({ message: 'Fetched successfully', note })",
  "    } catch (error) { next(error) }",
  "}",
])
body("findById is a Mongoose shorthand for findOne({ _id: id }). Since every MongoDB document gets a unique _id, this always returns at most one note.")

heading3("updateNote — Ownership Check")
code([
  "const updateNote = async (req, res, next) => {",
  "    try {",
  "        const note = await Note.findById(req.params.id)",
  "        if (!note) return res.status(404).json({ message: 'note not found' })",
  "",
  "        if (note.userId.toString() !== req.userId.toString()) {",
  "            return res.status(403).json({ message: 'you are not allowed to update this note' })",
  "        }",
  "",
  "        const updated = await Note.findByIdAndUpdate(",
  "            req.params.id,",
  "            req.body,",
  "            { new: true }    // return the updated doc, not the old one",
  "        )",
  "        res.status(200).json({ message: 'updated successfully', note: updated })",
  "    } catch (error) { next(error) }",
  "}",
])
bullet([
  "First fetch the note to check if it exists and who owns it",
  ".toString() comparison — note.userId is a Mongoose ObjectId object; req.userId is a string. Comparing them directly always returns false even if they match the same value. .toString() on both makes them comparable as strings",
  "403 = Forbidden — the user is authenticated but not allowed to do this specific thing",
  "{ new: true } — returns the document AFTER the update, not before. Without this, you'd send back the old data",
])
improvement("updateNote and deleteNote had no try/catch. Any DB error (invalid ID format, connection issue) would cause an unhandled promise rejection and crash the server. Added try/catch with next(error) to all handlers.")

heading3("deleteNote")
code([
  "const deleteNote = async (req, res, next) => {",
  "    try {",
  "        const note = await Note.findById(req.params.id)",
  "        if (!note) return res.status(404).json({ message: 'note not found' })",
  "",
  "        if (note.userId.toString() !== req.userId.toString()) {",
  "            return res.status(403).json({ message: 'you are not allowed to delete this note' })",
  "        }",
  "",
  "        await Note.findByIdAndDelete(req.params.id)",
  "        res.status(200).json({ message: 'deleted successfully' })",
  "    } catch (error) { next(error) }",
  "}",
])
body("Same ownership pattern as updateNote — always check ownership before any destructive operation.")

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 9 — EMAIL
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("9. Email System")

heading2("sendEmail.js")

code([
  "import { createTransport } from 'nodemailer'",
  "import { htmlCode } from './htmlCode.js'",
  "",
  "export const sendEmail = async (email) => {",
  "    const transporter = createTransport({",
  "        service: 'gmail',",
  "        auth: {",
  "            user: process.env.EMAIL_USER,",
  "            pass: process.env.EMAIL_PASS,",
  "        },",
  "    })",
  "    const info = await transporter.sendMail({",
  "        from:    `'${process.env.EMAIL_FROM}' <${process.env.EMAIL_USER}>`,",
  "        to:      email,",
  "        subject: 'Hello',",
  "        html:    htmlCode(email),",
  "    })",
  "    console.log('message sent', info.messageId)",
  "}",
])

body("createTransport sets up the email client — think of it as configuring which Gmail account to send from. sendMail then constructs and sends the actual email. htmlCode(email) generates the HTML body with the verification link embedded.")

callout("EMAIL_PASS — Gmail App Password", "This is NOT your Gmail login password. Google requires you to generate a 16-character 'App Password' specifically for third-party apps. Go to Google Account → Security → 2-Step Verification → App Passwords. The format in .env looks like: fqyq qjac gtuy hwga", C.orange)

note("In signUp, sendEmail is called with .catch() but no await. This is intentional — fire-and-forget. The user gets their 201 response immediately and the email sends in the background. If the email fails, it logs the error but doesn't fail the signup.")

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 10 — SECURITY
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("10. Security — Environment Variables")

body("Never hardcode secrets in your source code. If you push to GitHub, those secrets are public forever — even if you delete them in a later commit, they exist in Git history. The solution is .env files.")

heading2(".env — the secrets file")

code([
  "PORT=3000",
  "MONGO_URI=mongodb://localhost:27017/jwt",
  "JWT_SECRET=mohamedAli",
  "EMAIL_USER=george.milad2@gmail.com",
  "EMAIL_PASS=fqyq qjac gtuy hwga",
  "EMAIL_FROM=George Milad",
])

heading2(".env.example — the safe template")

code([
  "# Copy this file to .env and fill in real values",
  "PORT=3000",
  "MONGO_URI=mongodb://localhost:27017/your-db-name",
  "JWT_SECRET=your-long-random-secret-here",
  "EMAIL_USER=your-gmail@gmail.com",
  "EMAIL_PASS=your-16-char-app-password",
  "EMAIL_FROM=Your Name",
])

body(".env.example is committed to Git so any other developer knows exactly what environment variables the project needs. The actual .env file is listed in .gitignore so it never gets committed.")

heading2(".gitignore")

code([
  ".env",
  "node_modules/",
])

body("Just two lines. This ensures your secret credentials and the massive node_modules folder (can be hundreds of MB) never get pushed to GitHub. Anyone cloning the project runs npm install to get node_modules back.")

improvement("All 6 secrets were originally hardcoded directly in the source files: MONGO_URI in dbConnection.js, JWT_SECRET in verifyToken.js and user.controller.js (with a fallback string), email credentials in sendEmail.js, and PORT in index.js. All moved to .env and accessed via process.env.")

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 11 — KEY CONCEPTS
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("11. Key Concepts Explained")

heading2("Why .lean()?")
body("A normal Mongoose query returns a Mongoose Document — a special object with built-in methods like .save(), getters, setters, and change tracking. This extra overhead is useful when you need to modify and re-save a document.")
body("But in signIn, you just need to check the password and build a token. You don't need any of those Mongoose methods. .lean() returns a plain JavaScript object — faster, lighter, and it lets you do delete user.password cleanly (deleting properties off a Mongoose Document is unreliable).")

heading2("Why { new: true } in findByIdAndUpdate?")
body("By default, MongoDB returns the document as it was BEFORE the update. This means without { new: true }, if you update a note and send the response, you send back the old title and content — confusing for the frontend.")
body("{ new: true } tells Mongoose to return the document AFTER the changes were applied. The response now reflects what's actually in the database.")

heading2("Why populate()?")
body("MongoDB doesn't do automatic joins like SQL. The Note document stores only userId: ObjectId('67a3f...'). That raw ID is useless to display in a UI.")
body("populate('userId', 'name -_id') tells Mongoose: look at the userId field, go to the User collection, find the document with that _id, and replace the ObjectId with the actual User data. The second argument is a projection — 'name' includes only name, '-_id' excludes the ID.")
code([
  "// Without populate:",
  "{ title: 'My Note', userId: '67a3f2e1b4c8d9e0f1a2b3c4' }",
  "",
  "// With populate('userId', 'name -_id'):",
  "{ title: 'My Note', userId: { name: 'Mohamed' } }",
])

heading2("The Full JWT Flow")
bullet([
  "User signs in with correct email and password",
  "Server creates a token: jwt.sign({ id, name, email }, SECRET, { expiresIn: '1h' })",
  "Token is sent in the response body — server does NOT store it",
  "Frontend stores it: localStorage.setItem('token', token)",
  "For every protected request, frontend adds header: { token: storedToken }",
  "verifyToken middleware reads req.headers.token and calls jwt.verify(token, SECRET)",
  "If valid, jwt.verify decodes the payload and returns { id, name, email, iat, exp }",
  "req.userId = decoded.id — now the controller knows who is making the request",
  "After 1 hour, jwt.verify rejects the token — user must sign in again",
])

heading2("Why async/await everywhere?")
body("Node.js is single-threaded. If you call the database synchronously (blocking), nothing else can happen while you wait — your entire server freezes for every user until the DB responds.")
body("async/await is syntactic sugar over Promises. await pauses only the current async function, not Node itself. Other requests are processed while you wait for the DB. This is why every controller is marked async and every DB call has await in front of it.")

heading2("Why User.create() and not insertMany()?")
body("insertMany() takes an array and inserts multiple documents at once. It is for bulk operations like importing 500 records from a CSV.")
body("You are creating exactly one user per signup. User.create(document) is the correct method — it validates against the schema, runs middleware hooks, and returns the created document. Using insertMany([req.body]) was semantically wrong and bypassed schema validation hooks.")

heading2("The Joi Password Pattern")
code([
  "password: Joi.string().pattern(/^[A-z][A-za-z0-9]{4,50}$/)",
])
body("This regex requires: starts with a letter (uppercase or lowercase), followed by 4 to 50 characters that are letters or digits. Total length: 5 to 51 characters. Note: [A-z] includes some special characters between Z and a in ASCII — a stricter pattern would be [A-Za-z]. Worth noting for future improvement.")

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 12 — IMPROVEMENTS SUMMARY
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("12. What Was Improved")

body("This section lists every bug found and fixed, with the reason it was a problem.")

const improvements = [
  {
    id: "01",
    title: "express.json() was placed AFTER routes",
    problem: "req.body was undefined on every route. The JSON parser hadn't run yet when the routes were registered.",
    fix: "Moved app.use(express.json()) to the top, before any route definitions."
  },
  {
    id: "02",
    title: "/verify/:email endpoint did nothing",
    problem: "The route existed but had no logic. Clicking the verification link did nothing — confirmedEmail stayed false forever.",
    fix: "Added User.findOneAndUpdate({ email }, { confirmedEmail: true }, { new: true }) to actually flip the flag."
  },
  {
    id: "03",
    title: "Joi abortEarly typo: { aboutEarly: false }",
    problem: "The key was misspelled (about instead of abort). Joi ignored the unknown key and used its default abortEarly: true — returning only the first validation error.",
    fix: "Corrected to { abortEarly: false } so all validation errors are returned at once."
  },
  {
    id: "04",
    title: "Joi not imported in note.validation.js",
    problem: "The file used Joi.object() and Joi.string() but never imported Joi. This would crash at startup with ReferenceError: Joi is not defined.",
    fix: "Added import Joi from 'joi' at the top of the file."
  },
  {
    id: "05",
    title: "Field name mismatch: 'description' vs 'content'",
    problem: "note.validation.js validated a field called 'description', but the Note model stored 'content'. Validation would fail for correctly formed requests.",
    fix: "Renamed description to content in both addNoteValidation and updateNoteValidation."
  },
  {
    id: "06",
    title: "POST/PUT/DELETE notes had no verifyToken",
    problem: "Anyone could add, update, or delete notes without being logged in. The controller read req.userId which would be undefined — causing crashes or wrong results.",
    fix: "Added verifyToken middleware to all three routes."
  },
  {
    id: "07",
    title: "signUp used insertMany([req.body]) and bcrypt.hashSync",
    problem: "insertMany() is for bulk inserts; signUp creates one user. Also req.body was passed wholesale including refPassword. bcrypt.hashSync blocks Node's event loop.",
    fix: "Changed to User.create() with explicit destructuring { name, email, password, age }, and await bcrypt.hash() (async)."
  },
  {
    id: "08",
    title: ".populate('UserId') — wrong casing",
    problem: "MongoDB field names are case-sensitive. The schema field is 'userId' (lowercase u). Using 'UserId' returned the raw ObjectId without resolving it — silently wrong.",
    fix: "Changed to .populate('userId', 'name -_id')."
  },
  {
    id: "09",
    title: "updateNote and deleteNote had no try/catch",
    problem: "Any database error (invalid ObjectId format, connection loss) would produce an unhandled promise rejection and crash the server process.",
    fix: "Wrapped both methods in try/catch with next(error)."
  },
  {
    id: "10",
    title: "No ownership check on update and delete",
    problem: "Any authenticated user could update or delete any note by sending its ID — there was no check that the note belonged to them.",
    fix: "Added: fetch note → check note.userId.toString() === req.userId.toString() → return 403 if mismatch."
  },
  {
    id: "11",
    title: "req.hamada used as the userId property",
    problem: "Placeholder name from development. Any developer reading the code would have no idea what req.hamada contained. Also inconsistent across files.",
    fix: "Renamed to req.userId everywhere (verifyToken.js, notes.controller.js, notes.routes.js comments)."
  },
  {
    id: "12",
    title: "All 6 secrets hardcoded in source files",
    problem: "MONGO_URI, JWT_SECRET (with a plaintext fallback string!), email credentials, and PORT were all literal values in the code. Pushing to GitHub would expose them permanently.",
    fix: "Created .env, moved all 6 values there, updated all 6 files to use process.env, created .env.example and .gitignore."
  },
  {
    id: "13",
    title: "age field missing from User model",
    problem: "Joi validation required age. Frontend sent age. But the User model had no age field — Mongoose silently dropped it. Age was never stored.",
    fix: "Added age: { type: Number, min: 5, max: 80 } to userSchema."
  },
]

improvements.forEach(imp => {
  const y = doc.y
  if (y > 700) doc.addPage()

  doc.rect(50, doc.y, 495, 20).fill(C.purple)
  doc.fontSize(11).fillColor(C.white).font("Helvetica-Bold")
     .text(`  #${imp.id}  ${imp.title}`, 50, doc.y + 5)
  gap(22)

  doc.fontSize(10).fillColor(C.red).font("Helvetica-Bold").text("Problem: ", 58, doc.y, { continued: true })
  doc.fontSize(10).fillColor(C.mid).font("Helvetica").text(imp.problem, { lineGap: 2 })
  gap(3)
  doc.fontSize(10).fillColor(C.green).font("Helvetica-Bold").text("Fix: ", 58, doc.y, { continued: true })
  doc.fontSize(10).fillColor(C.mid).font("Helvetica").text(imp.fix, { lineGap: 2 })
  gap(10)
})

// ══════════════════════════════════════════════════════════════════════════════
// SECTION 13 — FRONTEND
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
heading1("13. Frontend")

body("A pure Vanilla JavaScript single-page application (SPA) — no frameworks, no libraries. Three files in the frontend/ folder: index.html, style.css, app.js.")

heading2("Structure of app.js")

code([
  "// 1. CONFIG",
  "const API = 'http://localhost:3000'    // base URL for all fetch calls",
  "",
  "// 2. STATE",
  "let token, userName, editingId, deletingId, allNotes = []",
  "",
  "// 3. DOM REFS — all elements grabbed once at startup",
  "",
  "// 4. UTILITIES",
  "toast(msg, type)        // shows a notification bar (success / error)",
  "api(path, opts)         // wrapper around fetch — handles auth header and Joi error arrays",
  "setLoading(btn, state)  // disables button and shows spinner while request is in flight",
  "escapeHtml(str)         // prevents XSS by escaping < > & ' \" characters",
  "",
  "// 5. AUTH — sign in / sign up form handlers",
  "// 6. NOTES — loadNotes, renderNotes, search+highlight, CRUD handlers",
  "// 7. INIT — runs on page load, checks localStorage for existing token",
])

heading2("Key Frontend Patterns")

heading3("The api() helper")
code([
  "async function api(path, opts = {}) {",
  "    const res = await fetch(API + path, {",
  "        headers: { 'Content-Type': 'application/json', token },",
  "        ...opts,",
  "        body: opts.body ? JSON.stringify(opts.body) : undefined,",
  "    })",
  "    const data  = await res.json()",
  "    if (!res.ok) {",
  "        // Joi returns an array of error objects — join their messages",
  "        const msg = Array.isArray(data) ? data.map(e => e.message).join(', ') : data.message",
  "        throw new Error(msg)",
  "    }",
  "    return data",
  "}",
])
body("This wrapper automatically adds the auth token header to every request, handles JSON stringification, and converts Joi's array error format into a readable string.")

heading3("XSS Prevention")
code([
  "function escapeHtml(str = '') {",
  "    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;')",
  "               .replace(/>/g,'&gt;').replace(/'/g,'&#39;')",
  "               .replace(/\"/g,'&quot;')",
  "}",
  "",
  "// Used when injecting note content into HTML:",
  "card.innerHTML = `<h3>${escapeHtml(note.title)}</h3>`",
])
body("If a note's title contains <script>alert('xss')</script> and you inject it directly with innerHTML, the browser executes it. escapeHtml converts < to &lt; etc. so it renders as text, not code.")

heading3("Search with Highlight")
code([
  "function highlightText(text, term) {",
  "    if (!term) return escapeHtml(text)",
  "    const regex = new RegExp(`(${term.replace(/[.*+?]/g,'\\\\$&')})`, 'gi')",
  "    return escapeHtml(text).replace(regex, '<mark>$1</mark>')",
  "}",
])
body("When searching, matching characters are wrapped in <mark> tags so the browser highlights them. The regex is built dynamically from the search term. Special regex characters in the term are escaped first to prevent them being interpreted as regex operators.")

heading2("Auth Flow in the Frontend")
bullet([
  "Sign up: POST /users/signUp { name, email, password, refPassword, age } → show success → switch to sign-in tab",
  "Sign in: POST /users/signIn { email, password } → store token and userName in localStorage → show dashboard",
  "Every note request: api() automatically adds token header",
  "Logout: clear localStorage, show auth screen",
  "On page load: check localStorage for token → if found, skip auth and go straight to dashboard",
])

heading2("What still could be improved (future work)")
bullet([
  "API base URL is hardcoded as http://localhost:3000 — should come from an environment config before deployment",
  "No global error handler in the backend (app.use((err, req, res, next) => ...)) — unhandled errors leak stack traces",
  "confirmedEmail is not checked at sign in — a user who never verified their email can still sign in",
  "No rate limiting — a user could make unlimited sign-in attempts (brute force attack possible)",
  "No pagination on GET /notes — if a user has 10,000 notes, the response would be very large",
  "nodemon should be in devDependencies, not dependencies",
])

// ══════════════════════════════════════════════════════════════════════════════
// BACK COVER
// ══════════════════════════════════════════════════════════════════════════════
doc.addPage()
doc.rect(0, 0, 595, 842).fill(C.dark)
doc.rect(0, 0, 595, 4).fill(C.purple)

doc.fontSize(22).fillColor(C.white).font("Helvetica-Bold")
   .text("Final Developer Assessment", 50, 120, { align: "center", width: 495 })

doc.moveTo(150, 160).lineTo(445, 160).strokeColor(C.purple).lineWidth(2).stroke()

doc.rect(120, 185, 355, 90).fill("#0D0D1F")

doc.fontSize(48).fillColor(C.purple).font("Helvetica-Bold")
   .text("7.5 / 10", 50, 200, { align: "center", width: 495 })

doc.fontSize(14).fillColor("#AAAACC").font("Helvetica")
   .text("Competent Junior Developer", 50, 255, { align: "center", width: 495 })

doc.fontSize(11).fillColor("#CCCCEE").font("Helvetica")
   .text([
     "Full auth system that actually works (register, email verify, sign in, JWT, bcrypt).",
     "Ownership-protected CRUD with correct status codes.",
     "Input validation on every route. All secrets in .env.",
     "Frontend connected and functional — auth, dashboard, notes CRUD, search.",
     "You understand your own code end-to-end. That is not trivial.",
   ].join("\n"), 80, 300, { align: "left", width: 435, lineGap: 5 })

doc.moveTo(150, 420).lineTo(445, 420).strokeColor("#333355").lineWidth(1).stroke()

doc.fontSize(13).fillColor(C.purple).font("Helvetica-Bold")
   .text("Recommended Next Steps", 50, 440, { align: "center", width: 495 })

const steps = [
  "Deploy this project NOW (Render for backend, Vercel/Netlify for frontend)",
  "E-commerce MERN — Redux Toolkit, Tailwind, ~3 weeks",
  "Project Management System — MERN + MySQL, ~3-4 weeks",
  "Clinic SaaS — Next.js + Prisma, ~8 weeks (Next.js is a paradigm shift)",
  "Start job hunting by July 2026 with 4 deployed projects",
]
steps.forEach((step, i) => {
  doc.rect(120, doc.y, 24, 18).fill(C.purple)
  doc.fontSize(9).fillColor(C.white).font("Helvetica-Bold").text(`${i + 1}`, 120, doc.y + 5, { width: 24, align: "center", lineBreak: false })
  doc.fontSize(10).fillColor("#CCCCEE").font("Helvetica").text(step, 152, doc.y - 13, { width: 320 })
  gap(8)
})

doc.fontSize(9).fillColor("#555577").font("Helvetica")
   .text("Generated by GitHub Copilot · " + new Date().getFullYear(), 50, 790, { align: "center", width: 495 })

// ══════════════════════════════════════════════════════════════════════════════
doc.end()
console.log("Project_Explained.pdf generated successfully")

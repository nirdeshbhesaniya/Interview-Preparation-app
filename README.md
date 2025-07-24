# 🧠 InterviewPrep AI – Full-Stack AI Interview Practice App

A powerful MERN-based AI-powered interview preparation platform with rich UI, interactive features, and smart Gemini API integrations to generate, regenerate, summarize, pin, and mark technical Q&A.

---

## 🚀 Live Demo

🔗 [Interview AI](https://interview-preparation-app-1.onrender.com)

---

## 📦 Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, Lucide Icons, ReactMarkdown, rehype-highlight, remark-gfm
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **AI Engine:** Google Gemini API (Generative AI)
- **Hosting:** Render
- **Others:** Cloudinary (for image upload), React Hot Toast, Moment.js

---

## ✨ Features

- 🔐 **User Auth:** Register/Login securely with image upload.
- 🎯 **AI-Powered Interview Q&A:** Generate questions & rich markdown answers using Gemini.
- 🛠️ **Regenerate Answers:** Instantly regenerate any AI-generated answer.
- 📝 **Edit Answers:** Manually edit any AI content inline.
- 📌 **Pin to Top:** Reorder and prioritize key Q&A.
- ⭐ **Mark as Important:** Flag questions for last-minute revision.
- 🔍 **Summarize Answer (TL;DR):** AI-generated 2-3 sentence summary.
- 📁 **Export as Markdown:** Download all session Q&A in markdown.
- 🔗 **Share Sessions:** Copy direct link to specific session.
- 🌙 **Dark Mode:** Fully supported.
- ⬇️ **Pagination:** Load more Q&A on demand.
- 🧠 **Generate More Qs:** Extend the session dynamically.

---

## Environment Variables

### Backend (.env file in /backend directory)

```env
# 🔌 Server Configuration
PORT=5000  # The port your Express server will run on

# 🗄️ MongoDB Database
MONGODB_URI=your_mongodb_connection_string  # Replace with your MongoDB Atlas or local URI

# 🤖 Google Gemini AI API
GEMINI_API_KEY=your_gemini_api_key  # Get this from https://aistudio.google.com/app/apikey

# ☁️ Cloudinary Image Hosting
CLOUDINARY_NAME=your_cloudinary_cloud_name  # From Cloudinary dashboard
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# 💻 Judge0 API for Code Compilation (Required for Codebase feature)
RAPIDAPI_KEY=your_rapidapi_key_here  # Get this from https://rapidapi.com/judge0-official/api/judge0-ce
```

### API Keys Setup Guide

1. **Judge0 API (For Code Compilation):**
   - Visit [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
   - Subscribe to the free plan (500 requests/month)
   - Copy your RapidAPI key and add it to your `.env` file

2. **Google Gemini API:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

3. **MongoDB:**
   - Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
   - Get your connection string and add it to your `.env` file

4. **Cloudinary (Optional):**
   - Create account at [Cloudinary](https://cloudinary.com/)
   - Get your credentials from the dashboard

---

## 🛠️ Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/nirdeshbhesaniya/Interview-Preparation-app.git
cd Interview-Preparation-app
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file with required environment variables
cp .env.example .env
# Edit .env file with your actual API keys and database URL

# Start the backend server
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start the development server
npm run dev
```

### 4. Access the Application

- **Frontend:** <http://localhost:5173>
- **Backend:** <http://localhost:5000>

### 5. Test Code Compilation Feature

1. Make sure your backend `.env` file has the `RAPIDAPI_KEY` for Judge0
2. Navigate to the Codebase section in the app
3. Write some code and click "Run Code" to test the compilation feature

---

## 🔧 Troubleshooting

### Code Compilation Issues

If you're getting 404 errors for code compilation:

1. **Check Backend Server:** Make sure the backend is running on port 5000
2. **Verify API Key:** Ensure you have added the `RAPIDAPI_KEY` to your `.env` file
3. **Check Route:** The compilation endpoint should be available at `/api/compile`

### Common Errors

- **"Backend server not available":** Start the backend server with `npm start`
- **"Code execution service unavailable":** Add your RapidAPI key to the `.env` file
- **"Internal server error":** Check your API key validity and internet connection

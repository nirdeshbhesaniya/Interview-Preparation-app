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

## Environment Variable 

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



---

## 🛠️ Local Development

### 1. Clone the Repo

```bash
git clone https://github.com/nirdeshbhesaniya/Interview-Preparation-app.git
cd interview-prep-app
cd backend
npm install
cd interview-prep-app
cd frontend
npm install
npm run dev 

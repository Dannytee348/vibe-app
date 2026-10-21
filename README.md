🍰 CaterCost & Pricing Engine

A full-stack micro-SaaS application built for food vendors, pastry chefs, and caterers to accurately calculate exact ingredient expenses, overhead costs, and profitable retail pricing in real time.

✨ Features

Dynamic Ingredient Builder: Add, edit, or remove ingredients with real-time cost calculation.

Overhead & Profit Margins: Factor in utilities/packaging overhead and adjust profit margin sliders instantly.

Yield-Based Unit Pricing: Automatically breaks down total batch cost into per-unit pricing (per slice, piece, or bowl).

Persistent Storage: Saves recipes and pricing structures securely to MongoDB Atlas.

Modern Responsive UI: Built with React, Vite, and Tailwind CSS for a seamless mobile and desktop experience.

🛠️ Tech Stack

Frontend (/client)

React (Vite)

Tailwind CSS

Lucide React (Icons)

Backend (/server)

Node.js & Express.js

Mongoose (MongoDB Atlas)

CORS & Dotenv

🚀 Live Demo

Check out the live production deployment on Vercel:
👉 https://vibe-app-amber-three.vercel.app

💻 Local Development Setup

If you want to clone and run this project locally on your machine:

Clone the repository:

git clone https://github.com/Dannytee348/vibe-app.git
cd vibe-app


Set up the Backend (/server):

cd server
npm install


Create a .env file inside server/ with:

PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173


Start the backend:

npm run dev


Set up the Frontend (/client):
Open a second terminal window, move to client, and run:

cd client
npm install
npm run dev


👨‍💻 Author

Built with 💻 and ☕ by Dannytee348.

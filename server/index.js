import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Helper middleware to ensure MongoDB connects on serverless requests (Vercel)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
      console.error("❌ MongoDB connection error:", err.message);
    }
  }
  next();
});

// Health Check
app.get("/api/health", (req, res) => {
  const dbState =
    mongoose.connection.readyState === 1
      ? "Connected to MongoDB"
      : "Running (MongoDB URI not added yet)";
  res.status(200).json({
    success: true,
    message: "Backend is live! Database status: " + dbState,
    timestamp: new Date().toISOString(),
  });
});

// Feature Routes
app.use("/api/recipes", recipeRoutes);

// Local development startup
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    if (process.env.MONGODB_URI) {
      try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB Atlas");
      } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
      }
    } else {
      console.log("⚠️ No MONGODB_URI in .env yet - starting server without DB");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  };

  startServer();
}

// Export app for Vercel serverless deployment
export default app;

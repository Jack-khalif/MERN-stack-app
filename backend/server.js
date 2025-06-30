import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";


const app = express();

app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = 
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL] 
        : ['http://localhost:5173'];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend", "Learn", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "Learn", "dist", "index.html"));
  });
}

console.log("Attempting to connect to the database...");
connectDB()
  .then(() => {
    console.log("Database connection successful. Starting server...");
    app.listen(PORT, () => {
      console.log(`Server started and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
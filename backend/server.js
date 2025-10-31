// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import certificateRoutes from "./routes/certificateRoutes.js";

// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// // Routes
// app.use("/api/certificates", certificateRoutes);

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Server is running!");
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import certificateRoutes from "./routes/certificateRoutes.js";

dotenv.config();

// ✅ Connect MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-domain.netlify.app" // replace with your real frontend domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/certificates", certificateRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("✅ Certificate Verification Server is Running...");
});

// ✅ Start server (Render will inject its own PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




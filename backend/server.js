import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";

// Import routes
import productRoute from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import mechanicRoutes from "./routes/mechanicRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

// Import utilities and middleware
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Import Socket.IO configuration
import { initSocket } from "./config/socket.js";

dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
(async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
})();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with the server
initSocket(server);

app.use(cors());

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing cookies
app.use(cookieParser());

// Basic route for checking if API is running
app.get("/", (req, res) => {
    res.send("API is running");
});

// Setup routes
app.use("/api/products", productRoute);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/paystack", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Serve static files from the "uploads" directory
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

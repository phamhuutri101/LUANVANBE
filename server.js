const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDB = require("./database/connectDB");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());


// MongoDB connection
connectDB();
// Routes
app.use(require("./router"));
// Start server
app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});

//

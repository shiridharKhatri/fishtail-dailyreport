const express = require("express");
const connectToDatabase = require("./database/connection");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path  = require('path')
const cookieParser = require("cookie-parser");
dotenv.config();

const DATABASE_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json()); 2

// app.get("/", async (req, res) => {
//   return res.redirect(302, 'https://zotetech.com');
// });

app.use("/api/auth/employee", require('./routes/userRoute') )
app.use("/api/report/employee", require("./routes/reportRoute"))
app.use("/attachments", express.static(path.join(__dirname, "images")));

app.get("/", async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is active",
  });
});

connectToDatabase(DATABASE_URL)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

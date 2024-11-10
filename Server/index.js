const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const database = require("./config/database");
const adminRoutes = require("./routers/Admin");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary")
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
    })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

database.connect();

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

cloudinaryConnect();

app.use("/api/v1",adminRoutes);

app.get("/", (req,res) => {
    return res.status(200).json({
        success:true,
        message: "Your server is up and running...."
    });
});

app.listen(PORT, () => {
    console.log(`Your server started at ${PORT}`);
})
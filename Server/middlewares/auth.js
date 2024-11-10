const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
    try {
        const token = 
            req.cookies.token || 
            req.body.token || 
            (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
        
        console.log("Extracted token:", req.body);  

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"  
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decode);
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
                error: error.message
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

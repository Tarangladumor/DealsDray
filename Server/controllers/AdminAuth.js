const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.signup = async(req,res) => {
    try {
        const {
            username,
            password
        } = req.body;

        if(!username || !password){
            return res.status(403).json({
                success: false,
                message: "All the feilds are required"
            });
        }

        const existUser = await Admin.findOne({username});

        if(existUser){
            return res.status(400).json({
                success:false,
                message:"User Already Exists",
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const admin = await Admin.create({
            username,
            password:hashedPassword
        });

        return res.status(200).json({
            success:true,
            message:"Admin created successfully",
            data:admin
        });
    } catch (error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Admin not registerd, please try again"
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and Password are Required",
            });
        }

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin does not exist",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password",
            });
        }

        const payload = {
            id: admin._id,
            username: admin.username,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'defaultsecret', {
            expiresIn: "2h",
        });

        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
            httpOnly: true,
        };

        admin.password = undefined;

        res.cookie("token", token, options);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                id: admin._id,
                user: admin,
                token : token
            },
        });

    } catch (error) {
        console.error("Error during admin login:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed, please try again later.",
        });
    }
};

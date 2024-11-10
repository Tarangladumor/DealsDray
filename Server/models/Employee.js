const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: Number,
        required: true,
        unique: true,  
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNo: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
    },
    designation: {
        type: String,
        required: true,
        enum: ["HR", "Manager", "Sales"],  
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    course: {
        type: [String],  
        required: true,
        enum: ["MCA", "BCA", "BSC"],  
    },
    image: {
        type: String,
        required: true,  
    },
    createdDate: {
        type: Date,
        default: Date.now,  
    }
});

module.exports = mongoose.model("Employee", employeeSchema);

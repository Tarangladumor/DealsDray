const mongoose = require("mongoose");

const employeeCounterSchema = new mongoose.Schema({
    employeeId: {
        type: Number,
        required: true,
        unique: true, 
    }
});

module.exports = mongoose.model("EmployeeCounter", employeeCounterSchema);

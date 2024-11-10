const Employee = require("../models/Employee");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const EmployeeCounter = require('../models/EmployeeCounter'); 

exports.createEmployee = async (req, res) => {
    try {
        let {
            name, email, mobileNo, designation, gender, course
        } = req.body;

        if (typeof course === "string") {
            course = JSON.parse(course); 
        }

        const employeeImg = req.files?.employeeImage;

        // Validate required fields
        if (!name || !email || !mobileNo || !designation || !gender || !course || !employeeImg) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, including employee image."
            });
        }

        // Handle image upload to Cloudinary
        const employeeImage = await uploadImageToCloudinary(employeeImg, process.env.FOLDER_NAME);

        // Fetch the last used employeeId from the counter
        let counter = await EmployeeCounter.findOne();
        if (!counter) {
            // If no counter exists, initialize the counter
            counter = new EmployeeCounter({ employeeId: 1 });
            await counter.save();
        } else {
            // Increment the counter for the new employee
            counter.employeeId += 1;
            await counter.save();
        }

        // Create the new employee with the incremented employeeId
        const employee = await Employee.create({
            employeeId: counter.employeeId, // Assign the incremented ID
            name,
            email,
            mobileNo,
            designation,
            gender,
            course,
            image: employeeImage.secure_url,
        });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully.",
            data: employee,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Employee not created successfully",
            error: error.message
        });
    }
};



exports.deleteEmployee = async(req,res) => {
    try {
        const employeeId = req.params.id;

        const employee = await Employee.findById(employeeId);

        if(!employee){
            return res.status(401).json({
                success:false,
                message:"Employee Not Found"
            })
        }

        await Employee.findByIdAndDelete(employeeId);

        return res.status(200).json({
            success : true,
            message : "Employee Deleted Successfully"
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Employee does not deleted.",
            error : error.message
        })
    }
}

exports.editEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id; 
        const updates = req.body;

        console.log(`Editing employee with ID: ${employeeId}`);
        console.log('Received updates:', updates);

        // Validate required fields
        const { name, email, mobileNo, designation, gender, course } = updates;
        if (!name || !email || !mobileNo || !designation || !gender || !course) {
            return res.status(400).json({
                success: false,
                message: "All fields are required, including employee image.",
            });
        }

        // Parse the course field if it's a string
        if (typeof course === "string") {
            updates.course = course.split(',');  // Split string to array
        }

        // Ensure course is an array
        if (!Array.isArray(updates.course)) {
            return res.status(400).json({
                success: false,
                message: "Course must be an array.",
            });
        }

        // Validate that the course contains only allowed values
        const allowedCourses = ["MCA", "BCA", "BSC"];
        const invalidCourses = updates.course.filter(course => !allowedCourses.includes(course));
        
        if (invalidCourses.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid course(s): ${invalidCourses.join(", ")}`,
            });
        }

        // Find the employee by _id (not employeeId)
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee does not exist.",
            });
        }

        // If image is uploaded, handle it
        if (req.files) {
            try {
                const employeeImg = req.files.employeeImage;
                const employeeImage = await uploadImageToCloudinary(employeeImg, process.env.FOLDER_NAME);
                employee.image = employeeImage.secure_url;
            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error);
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                    error: error.message,
                });
            }
        }

        // Update employee fields with the provided updates (excluding employeeId)
        for (const key in updates) {
            if (updates.hasOwnProperty(key) && key !== 'employeeId') {
                employee[key] = updates[key];
            }
        }

        // Save the updated employee document
        await employee.save();

        // Retrieve the updated employee information
        const updatedEmployee = await Employee.findById(employeeId);

        return res.json({
            success: true,
            message: "Employee updated successfully.",
            data: updatedEmployee,
        });
    } catch (error) {
        console.error('Error during employee update:', error);
        return res.status(500).json({
            success: false,
            message: "Employee not updated yet.",
            error: error.message,
        });
    }
};



exports.getEmployees = async(req,res) => {
    try {
        const allEmployee = await Employee.find({});

        return res.status(200).json({
            success:true,
            message:"All employee are here",
            data : allEmployee
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"All Employee Nor Getting",
            error : error.message
        })
    }
}

exports.getEmployeeById = async (req, res) => {
    try {
        const employeeId  = req.params.id;

        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee retrieved successfully",
            data: employee,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve employee",
            error: error.message,
        });
    }
};

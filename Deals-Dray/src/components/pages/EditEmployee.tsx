import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getEmployeeById, editEmployee } from '../../services/operations/employeeApi';
import { useAppSelector } from '../../store';

export interface Employee {
  _id: string; // Use _id instead of id
  name: string;
  email: string;
  mobileNo: string;
  designation: 'HR' | 'Manager' | 'Sales' | '';
  gender: 'Male' | 'Female' | 'Other';
  course: string[];
  image: string | File;
  createdDate: string;
}

const EditEmployee: React.FC = () => {
  const { token } = useAppSelector((state) => state.Admin);
  const { id } = useParams<{ id: string }>(); // id from URL params
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee>({
    _id: '', // Initialize with _id
    name: '',
    email: '',
    mobileNo: '',
    designation: 'HR',
    gender: 'Male',
    course: [],
    image: '',
    createdDate: '',
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (id) {
        setLoading(true);
        const employeeData = await getEmployeeById(id, token);
        if (employeeData) {
          setEmployee(employeeData); // Ensure employeeData contains _id
        } else {
          toast.error('Failed to load employee details');
        }
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [id, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setEmployee((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setEmployee((prev) => {
      const updatedCourses = checked
        ? [...prev.course, value]
        : prev.course.filter((course) => course !== value);
      return { ...prev, course: updatedCourses };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the form data with employee details
    const formData = new FormData();
    formData.append('employeeId', employee._id);  // Use _id instead of id
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('mobileNo', employee.mobileNo);
    formData.append('designation', employee.designation);
    formData.append('gender', employee.gender);
    formData.append('course', employee.course.join(',')); // Assuming multiple courses are comma separated
    if (employee.image && typeof employee.image !== 'string') {
      formData.append('employeeImage', employee.image); // Append image if it is a file
    }

    // Send the data using editEmployee API
    const result = await editEmployee(formData, token, employee._id);  // Use _id here too
    if (result) {
      toast.success('Employee updated successfully');
      navigate('/employee-list');
    } else {
      toast.error('Failed to update employee');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-gray-700">Mobile No</label>
          <input
            type="tel"
            name="mobileNo"
            value={employee.mobileNo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Designation */}
        <div>
          <label className="block text-gray-700">Designation</label>
          <select
            name="designation"
            value={employee.designation}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={employee.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Course (Checkboxes) */}
        <div>
          <label className="block text-gray-700">Courses</label>
          <div className="space-x-4">
            {['MCA', 'BCA', 'BSC'].map((course) => (
              <label key={course} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value={course}
                  checked={employee.course.includes(course)}
                  onChange={handleCourseChange}
                  className="form-checkbox"
                />
                <span className="ml-2">{course}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Display and Upload */}
        <div>
          <label className="block text-gray-700">Image</label>
          {employee.image && typeof employee.image === 'string' ? (
            <div className="mb-2">
              <img src={employee.image} alt="Employee" className="w-32 h-32 object-cover" />
            </div>
          ) : (
            <div className="mb-2">No image uploaded</div>
          )}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;

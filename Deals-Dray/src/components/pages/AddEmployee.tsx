import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../../services/operations/employeeApi';
import { AppDispatch, useAppSelector } from '../../store';

interface EmployeeFormData {
  name: string;
  email: string;
  mobileNo: string;
  designation: "HR" | "Manager" | "Sales";
  gender: "Male" | "Female";
  course: ("MCA" | "BCA" | "BSC")[];
  image: File | null;
}

const AddEmployee: React.FC = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    mobileNo: '',
    designation: "HR",
    gender: "Male",
    course: [],
    image: null,
  });

  const dispatch = useDispatch<AppDispatch>();
  const { token } = useAppSelector((state) => state.Admin);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      // Cast value to a valid course type ("MCA" | "BCA" | "BSC")
      const courseValue = value as "MCA" | "BCA" | "BSC";

      setFormData((prevData) => ({
        ...prevData,
        course: prevData.course.includes(courseValue)
          ? prevData.course.filter((c) => c !== courseValue)
          : [...prevData.course, courseValue],
      }));
    } else if (name === "gender") {
      setFormData({
        ...formData,
        [name]: value as "Male" | "Female", // Gender is fixed
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure the image is non-null before dispatching
    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    // Cast formData as EmployeeData with a non-null image property
    dispatch(addEmployee({ ...formData, image: formData.image }, navigate, token));

    // Optionally reset the form
    setFormData({
      name: '',
      email: '',
      mobileNo: '',
      designation: "HR",
      gender: "Male",
      course: [],
      image: null,
    });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Mobile Number */}
        <input
          type="tel"
          name="mobileNo"
          placeholder="Mobile Number"
          value={formData.mobileNo}
          onChange={handleChange}
          pattern="\d{10}"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Designation */}
        <select
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Designation</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>

        {/* Gender */}
        <div className="flex items-center space-x-4">
          <label className="font-semibold">Gender:</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleChange}
              checked={formData.gender === 'Male'}
              className="mr-1"
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleChange}
              checked={formData.gender === 'Female'}
              className="mr-1"
            />
            Female
          </label>
        </div>

        {/* Course */}
        <div className="flex items-center space-x-4">
          <label className="font-semibold">Course:</label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="MCA"
              onChange={handleChange}
              checked={formData.course.includes('MCA')}
              className="mr-1"
            />
            MCA
          </label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="BCA"
              onChange={handleChange}
              checked={formData.course.includes('BCA')}
              className="mr-1"
            />
            BCA
          </label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="BSC"
              onChange={handleChange}
              checked={formData.course.includes('BSC')}
              className="mr-1"
            />
            BSC
          </label>
        </div>

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;

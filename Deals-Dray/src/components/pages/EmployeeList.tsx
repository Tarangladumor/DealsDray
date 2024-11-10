import React, { useEffect, useState } from 'react';
import { getAllEmployee, deleteEmployee } from '../../services/operations/employeeApi'; // Import delete function
import { toast } from 'react-hot-toast';
import { useAppSelector } from '../../store';
import { useNavigate } from 'react-router-dom';

interface Employee {
  _id: string;
  name: string;
  email: string;
  mobileNo: string;
  designation: string;
  gender: string;
  course: string[];
  image: string;
  createdDate: string;
  employeeId: number;
}

const EmployeeList: React.FC = () => {
  const { token } = useAppSelector((state) => state.Admin);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('email');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Adjust number of items per page
  const navigate = useNavigate();

  // Fetch employees initially
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const result = await getAllEmployee(token);
      if (result.length > 0) {
        setEmployees(result);
      } else {
        // No employee data found, but no error toast is shown
        setEmployees([]);
      }
    } catch (error) {
        console.log(error);
      toast.error('Error fetching employee data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  // Handle sorting
  const handleSortChange = (field: string) => {
    setSortBy(field);
  };

  // Handle search filtering
  const filteredEmployees = employees
    .filter((employee) => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const getValue = (employee: Employee, field: string) => {
        if (field === 'createdDate') {
          return new Date(employee.createdDate).getTime();
        } else if (field === 'email') {
          return employee.email.toLowerCase();
        } else if (field === 'employeeId') {
          return employee.employeeId;
        } else if (field === 'name') {
          return employee.name.toLowerCase();
        }
        return '';
      };

      const valueA = getValue(a, sortBy);
      const valueB = getValue(b, sortBy);

      // Always return in ascending order
      if (valueA < valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      }
      return 0;
    });

  // Paginate filtered employees
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleAddEmployee = () => {
    navigate('/create-employee');
  };

  // Delete employee handler
  const handleDelete = async (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employeeId, token);
        fetchEmployees();
      } catch (error) {
        console.log(error);
        toast.error('Error deleting employee');
      }
    }
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Employee List</h2>

      {/* Total Employee Count */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-medium text-gray-700">
          Total Employees: {employees.length}
        </div>

        {/* Add Employee Button */}
        <button
          onClick={handleAddEmployee}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      <div className="mb-4">
        {/* Search field */}
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 mr-4 rounded"
        />

        {/* Sorting options */}
        <select
          onChange={(e) => handleSortChange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="employeeId">Sort by Unique ID</option>
          <option value="email">Sort by Email</option>
          <option value="createdDate">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : employees.length === 0 ? (
        <div>No employees found.</div>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-2 border-b text-left">Unique ID</th>
              <th className="p-2 border-b text-left">Image</th>
              <th className="p-2 border-b text-left">Name</th>
              <th className="p-2 border-b text-left">Email</th>
              <th className="p-2 border-b text-left">Mobile No</th>
              <th className="p-2 border-b text-left">Designation</th>
              <th className="p-2 border-b text-left">Gender</th>
              <th className="p-2 border-b text-left">Course</th>
              <th className="p-2 border-b text-left">Created Date</th>
              <th className="p-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((employee, index) => (
              <tr key={index} className="even:bg-gray-100">
                <td className="p-2 border-b">{employee.employeeId}</td>
                <td className="p-2 border-b">
                  <img
                    src={employee.image}
                    alt={`${employee.name}'s Image`}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="p-2 border-b">{employee.name}</td>
                <td className="p-2 border-b">{employee.email}</td>
                <td className="p-2 border-b">{employee.mobileNo}</td>
                <td className="p-2 border-b">{employee.designation}</td>
                <td className="p-2 border-b">{employee.gender}</td>
                <td className="p-2 border-b">{employee.course.join(', ')}</td>
                <td className="p-2 border-b">{new Date(employee.createdDate).toLocaleDateString()}</td>
                <td className="p-2 border-b">
                  <button
                    className="px-2 py-1 mr-2 text-blue-600 hover:underline"
                    onClick={() => handleEdit(employee._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 text-red-600 hover:underline"
                    onClick={() => handleDelete(employee._id)} // Trigger the delete function
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination controls */}
      {employees.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Previous
          </button>
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../services/operations/authApi'; // Assuming logout action exists

const Dashboard: React.FC = () => {
  const { token } = useAppSelector((state) => state.Admin); // Assuming token is stored in the Admin slice
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is logged in or not
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    dispatch(logout(navigate)); // Dispatching logout action
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isLoggedIn ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
          <h1 className="text-4xl font-semibold text-gray-800 mb-4">👋 Hello, Welcome to your Dashboard!</h1>
          <p className="text-gray-600 mb-8 text-lg">You are successfully logged in. Manage your employees with the options below.</p>

          {/* Buttons */}
          <div className="space-y-6">
            <button
              onClick={() => navigate('/create-employee')}
              className="w-full py-3 px-5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              📝 Add Employee
            </button>

            <button
              onClick={() => navigate('/employee-list')}
              className="w-full py-3 px-5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition transform hover:scale-105"
            >
              👀 View Employee List
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 px-5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition transform hover:scale-105"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-10">
          <h2 className="text-xl font-semibold text-white mb-4">⚠️ Access Denied</h2>
          <p className="text-gray-200">You must be logged in to access the dashboard. Redirecting to login...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

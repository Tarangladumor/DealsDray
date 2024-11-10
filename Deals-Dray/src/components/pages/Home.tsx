import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store'; // Assuming you're using Redux for state management

const Home: React.FC = () => {
  const { token } = useAppSelector((state) => state.Admin); // Assuming token is stored in 'Admin' slice of the state
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect user to the login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        {token ? (
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome Back!</h1>
            <p className="text-gray-600">You are logged in. Feel free to explore your dashboard.</p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Our Platform</h1>
            <p className="text-gray-600 mb-4">Please log in to access your personalized content.</p>
            <button
              onClick={handleLoginRedirect}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

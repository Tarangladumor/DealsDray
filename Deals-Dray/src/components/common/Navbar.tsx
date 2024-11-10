import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, useAppSelector } from "../../store"; // Adjust path to your store setup
import { useDispatch } from "react-redux";
import { logout } from "../../services/operations/authApi";

const Navbar: React.FC = () => {
  const { token } = useAppSelector((state) => state.Admin);
  const { user } = useAppSelector((state) => state.User);
  
  const dispatch = useDispatch<AppDispatch>();
  const naviaget = useNavigate();

  const isLoggedIn = !!token;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white">
      <Link to="/" className="text-xl font-semibold hover:text-gray-400">
        Home
      </Link>

      {isLoggedIn && (
        <div className="flex space-x-8">
          <Link to="/employee-list" className="hover:text-gray-400 font-semibold">
            Employee List
          </Link>
        </div>
      )}

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link className="font-semibold" to={"/dashboard"}>
              {user?.username as string}
            </Link>
            <button onClick={() => {
                dispatch(logout(naviaget))
            }} className="hover:text-gray-400 font-semibold">Logout</button>
          </>
        ) : (
          <Link to="/login" className="hover:text-gray-400 font-semibold">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
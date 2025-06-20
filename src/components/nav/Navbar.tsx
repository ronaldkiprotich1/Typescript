import { NavLink } from "react-router-dom";
import CarRental from "../../assets/car-rental.png";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Mobile dropdown menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-10 mt-3 w-52 p-2 shadow bg-gray-600 text-white h-[200px] gap-2"
          >
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                Register
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
        <img src={CarRental} alt="car-rental" className="w-16" />
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "font-bold underline" : ""}>
              Dashboard
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Right side buttons */}
      <div className="navbar-end flex gap-4 rounded-md">
        <NavLink to="/login" className="btn">
          Login
        </NavLink>
        <NavLink to="/register" className="btn">
          Register
        </NavLink>
        <NavLink to="/profile" className="btn btn-ghost">
          Profile
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;

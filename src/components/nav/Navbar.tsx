import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost">
          <img 
            src="../../src/assets/logo.png" 
            alt="CarManager Logo" 
            className="h-25 w-auto"
          />
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/login" className="btn btn-primary">Login</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
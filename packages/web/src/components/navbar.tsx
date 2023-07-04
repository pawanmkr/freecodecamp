import SearchBox from "./searchBox";
import fccLogo from "../assets/fcclogo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBimobject } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const location = window.location.href;
    const regex = /\/courses/;
    if (regex.test(location)) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  return (
    <div className="navbar bg-dark-blue flex justify-between items-center py-2 w-full">
      <SearchBox />
      <div className="fcc-logo">
        <img src={fccLogo} alt="freecodecamp logo" className="w-[200px]" />
      </div>
      <div className="nav-items flex">
        <button className="text-yite border-2 px-5 mr-4">Menu</button>
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="logout-btn flex justify-center items-center bg-yello border-2 border-yellobd mr-2 p-0 text-dark-blue"
          >
            <p className="mr-1 px-2">Logout</p>
            <FaBimobject className="text-2xl mr-2 cursor-pointer" />
          </button>
        ) : (
          <button
            className="bg-yello px-5 border-yellobd border-2 mr-4"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

import SearchBox from "./searchBox";
import fccLogo from "../assets/fcclogo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-dark-blue flex justify-between items-center p-2 w-full">
      <SearchBox />
      <div className="fcc-logo">
        <img src={fccLogo} alt="freecodecamp logo" className="w-[200px]" />
      </div>
      <div className="nav-items">
        <button className="text-yite border-2 px-5">Menu</button>
        <button
          className="bg-yello px-5 border-yello"
          onClick={() => navigate("/signin")}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Navbar;

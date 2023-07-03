import SignIn from "../components/signin";
import fccLogo from "../assets/fcclogo.png";

const BASE_URI: string = import.meta.env.VITE_BASE_URL;

const SignInPage = () => {
  return (
    <>
      <div className="navbar bg-dark-blue text-center">
        <img src={fccLogo} alt="logo" />
      </div>
      <SignIn BASE_URI={BASE_URI} />
    </>
  );
};

export default SignInPage;

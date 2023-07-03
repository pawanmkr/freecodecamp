import SignIn from "../components/signin";
import fccLogo from "../assets/fcclogo.png";
import fccSmall from "../assets/fcc-small.svg";

const BASE_URI: string = import.meta.env.VITE_BASE_URI;

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center bg-gray-200 h-[100vh]">
      <div className="bg-dark-blue w-full flex justify-center items-center p-1 mb-16">
        <img src={fccLogo} alt="logo" className="w-[200px]" />
      </div>
      <SignIn BASE_URI={BASE_URI} logoPath={fccSmall} />
    </div>
  );
};

export default SignInPage;

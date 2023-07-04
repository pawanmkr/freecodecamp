import SignIn from "../components/signin";
import fccLogo from "../assets/fcclogo.png";
import fccSmall from "../assets/fcc-small.svg";
import { GoogleOAuthProvider } from "@react-oauth/google";

const BASE_URI: string = import.meta.env.VITE_BASE_URI;
const CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SignInPage = () => {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="flex flex-col items-center bg-gray-200 h-[100vh]">
        <div className="bg-dark-blue w-full flex justify-center items-center mb-16 p-2">
          <img src={fccLogo} alt="logo" className="w-[200px]" />
        </div>
        <SignIn BASE_URI={BASE_URI} logoPath={fccSmall} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignInPage;

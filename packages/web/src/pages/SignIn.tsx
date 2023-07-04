import SignIn from "../components/signin";
import fccLogo from "../assets/fcclogo.png";
import fccSmall from "../assets/fcc-small.svg";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignInPage = () => {
  const navigate = useNavigate();
  const jwt: string | null = localStorage.getItem("jwt");
  useEffect(() => {
    if (jwt) {
      navigate("/courses");
    }
  }, [jwt, navigate]);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="flex flex-col items-center bg-gray-200 h-[100vh]">
        <div className="bg-dark-blue w-full flex justify-center items-center mb-16 p-2">
          <img src={fccLogo} alt="logo" className="w-[200px]" />
        </div>
        <SignIn BASE_URI={import.meta.env.VITE_BASE_URI} logoPath={fccSmall} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignInPage;

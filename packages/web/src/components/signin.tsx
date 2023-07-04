type BaseURI = {
  BASE_URI: string;
  logoPath: string;
};

type InputFields = {
  id: string;
  name: string;
  type: string;
  required: boolean;
  placeholder: string;
  label: string;
};

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import googleIcon from "../assets/google.png";

const SignIn = ({ BASE_URI, logoPath }: BaseURI) => {
  const signinEndpoint = `${BASE_URI}/api/v1/user/signin`;
  const signupEndpoint = `${BASE_URI}/api/v1/user/signup`;
  const userInfoFromGoogleUrl = `${BASE_URI}/api/v1/user/signin/google`;

  /*
   * All the React Hooks
   */
  const navigate = useNavigate();
  const [emailExists, setEmailExists] = useState(false);
  const [noUserExists, setNoUserExists] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [values, setValues] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // Input fields to render in From
  const inputs: InputFields[] = [
    {
      id: "1",
      name: "fullname",
      type: "text",
      required: true,
      placeholder: "Fullname",
      label: "Fullname",
    },
    {
      id: "2",
      name: "email",
      type: "text",
      required: true,
      placeholder: "Email",
      label: "Email",
    },
    {
      id: "3",
      name: "password",
      type: "password",
      required: true,
      placeholder: "Password",
      label: "Password",
    },
  ];

  // updating form input values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  /*
   * Normal Signup/ Signin Method using form
   */
  const handleContinue = async () => {
    if (!values.fullname) {
      // If fullname is NULL, then do Login
      await axios
        .post(signinEndpoint, {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          const token: string = response.data;
          localStorage.setItem("jwt", token);
          navigate("/courses");
        })
        .catch((err) => {
          if (err.response.status === 404) {
            setNoUserExists(true);
          }
        });
    } else {
      // If fullname is PRESENT, then do Signup
      await axios
        .post(signupEndpoint, {
          fullName: values.fullname,
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          const token: string = response.data;
          localStorage.setItem("jwt", token);
          navigate("/courses");
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setEmailExists(true);
          }
        });
    }
  };

  /*
   * Google Login Method
   */
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await axios
          .post(userInfoFromGoogleUrl, {
            accessToken: tokenResponse.access_token,
          })
          .then((response) => {
            const token: string = response.data;
            localStorage.setItem("jwt", token);
            navigate("/courses");
          })
          .catch((err) => {
            if (err.response.status === 409) {
              setEmailExists(true);
            }
          });
      } catch (error) {
        console.error("Google Login Failed", error);
      }
    },
  });

  /*
   * Switch between login and signup form
   */
  const switchForm = () => {
    if (isSignup) setIsSignup(false);
    else setIsSignup(true);
  };

  return (
    <div className="signin w-[350px] border-4 border-black flex flex-col p-10 bg-white">
      <div className="title flex flex-col items-center mb-6">
        <img src={logoPath} alt="logo " className="w-[60px] mb-4" />
        <p className="text-2xl text-center">Log in to freeCodeCamp Learn</p>
      </div>

      {/* Google Login Button */}
      <div className="google-signin flex justify-center">
        <button
          type="button"
          className="flex justify-center items-center text-xl border-4 border-gray-300 p-2 w-full"
          onClick={() => googleLogin()}
        >
          <span className="mr-2">
            <img className="h-[24px]" src={googleIcon} alt="Google Icon" />
          </span>
          Signin with Google
        </button>
      </div>

      {/* Divider */}
      <div className="divider flex justify-center items-center my-4">
        <hr className="border-1 border-gray-500 w-full" />
        <p className="px-2">or</p>
        <hr className="border-1 border-gray-500 w-full" />
      </div>

      {/* Input Form */}
      <form
        className="form-container flex flex-col items-center"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/*
         * Input Fileds Fullname, Email and Password
         */}
        {inputs.map((input: InputFields) => {
          if (isSignup) {
            if (input.name === "fullname") {
              return;
            }
          }
          return (
            <input
              key={input.id}
              onChange={handleChange}
              value={values[input.name as keyof typeof values]}
              {...input}
              className="w-full border-2 border-black p-2 mb-3"
            />
          );
        })}

        {/* Signin / Signup Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="bg-yello border-yello w-full p-2"
        >
          Continue with Email
        </button>
      </form>

      {/* Form Switch Indicater */}
      <div className="signup-signin flex justify-center mt-2">
        <p className="mr-1">
          {isSignup ? "Don't have an account?" : "Already Have an Account?"}
        </p>
        <a onClick={switchForm} className="text-blue-700 cursor-pointer">
          {isSignup ? "Sign up" : "Sign in"}
        </a>
      </div>

      {/* Error to show when Email or User Already Exists */}
      {emailExists && (
        <div className="error mt-4">
          <p className="text-red-500 text-center">
            Email Already Exists! Please Login
          </p>
        </div>
      )}
      {noUserExists && (
        <div className="error mt-4">
          <p className="text-red-500 text-center">
            User Does not exists! Please Signup
          </p>
        </div>
      )}
    </div>
  );
};

export default SignIn;

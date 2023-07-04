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
  const navigate = useNavigate();
  const signInEndpoint = `${BASE_URI}/api/v1/user/signin`;
  const [emailExists, setEmailExists] = useState(false);
  const [values, setValues] = useState({
    fullname: "",
    email: "",
    password: "",
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const signIn = async () => {
    await axios
      .post(signInEndpoint, {
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
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await axios
          .post(`${BASE_URI}/api/v1/user/signin/google`, {
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
        {inputs.map((input: InputFields) => {
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
        <button
          type="button"
          onClick={signIn}
          className="bg-yello border-yello w-full p-2"
        >
          Continue with Email
        </button>
      </form>
      <div className="signup flex justify-center mt-2">
        <p className="mr-1">Don't have an account?</p>
        <a className="text-blue-700">Sign up</a>
      </div>
      {emailExists && (
        <div className="error mt-4">
          <p className="text-red-500 text-center">
            Email Already Exists! Please Login
          </p>
        </div>
      )}
    </div>
  );
};

export default SignIn;

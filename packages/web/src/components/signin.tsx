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

const SignIn = ({ BASE_URI, logoPath }: BaseURI) => {
  const signInEndpoint = `${BASE_URI}/api/v1/user/signin`;
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
        console.log(token);
      })
      .catch((err) => {
        const httpStatusCode: number = err.response.status;
        const errorMessage: string = err.response.data;
        if (httpStatusCode === 409) {
          // create a popup error

          console.log(errorMessage);
        }
      });
  };

  return (
    <div className="signin w-[350px] border-4 border-black flex flex-col p-10 bg-white">
      <div className="title flex flex-col items-center mb-6">
        <img src={logoPath} alt="logo " className="w-[60px] mb-4" />
        <p className="text-2xl text-center">Log in to freeCodeCamp Learn</p>
      </div>
      <div className="google-signin flex justify-center">
        <button>Continue with Google</button>
      </div>
      <div className="divider flex justify-center items-center my-4">
        <hr className="border-1 border-gray-500 w-full" />
        <p className="px-2">or</p>
        <hr className="border-1 border-gray-500 w-full" />
      </div>
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
    </div>
  );
};

export default SignIn;

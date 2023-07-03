type BaseURI = {
  BASE_URI: string;
};

import axios from "axios";
import { useState } from "react";

const SignIn = ({ BASE_URI }: BaseURI) => {
  const signInEndpoint = `${BASE_URI}/api/v1/user/signin`;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    await axios
      .post(signInEndpoint, {
        fullName: fullName,
        email: email,
        password: password,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="signin w-[400px] border-4 border-black flex flex-col p-10">
      <div className="title">
        <img src="" alt="logo " />
        <h2>Log in to freeCodeCamp Learn</h2>
      </div>
      <div className="google-signin">
        <button>Continue with Google</button>
      </div>
      <div className="divider">
        <hr />
        or
        <hr />
      </div>
      <div className="form-container flex flex-col items-center border-4 p-2">
        <input
          type="text"
          placeholder="Full Name"
          className="p-2 mb-2 w-full"
          onChange={(e) => {
            setFullName(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Email"
          className="p-2 mb-2 w-full"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Password"
          className="p-2 mb-2 w-full"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={signIn}
          className="bg-yello border-yello w-full p-2"
        >
          Continue with Email
        </button>
      </div>
    </div>
  );
};

export default SignIn;

import React, { useState } from "react";
import NavBar from "../navBar/navBar";

const LoginForm = ({ navigate }) => {
  const handleChange = (setFunction) => {
    return (event) => {
      setNotFound(false);
      setFunction(event.target.value);
    };
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let response = await fetch("/tokens", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (response.status !== 201) {
      setNotFound(true);
    } else {
      let data = await response.json();
      window.localStorage.setItem("token", data.token);
      navigate("/");
    }
  };

  const invalidDetails = () => {
    if (notFound) {
      return (
        <div className="text-red-600 text-base font-semibold">
          Invalid User Details
        </div>
      );
    } else {
      return <></>;
    }
  };

  return (
    <>
      <NavBar links={[]} />
      <div id="main-container" className="pt-16 ">
        <div className="flex justify-center">
          <div className="flex flex-col items-center mt-20 w-96 bg-white bg-opacity-20 py-4 rounded-xl">
            <div className="bg-white bg-opacity-75 py-8 px-9 rounded-xl">
              <div className="w-fit text-4xl mb-10 font-semibold text-green-900">
                Login
              </div>
              {invalidDetails()}
              <form onSubmit={handleSubmit} className="w-full">
                <div
                  id="login-email-container"
                  className="text-xl w-full mx-auto mb-4"
                >
                  <label
                    htmlFor="login-email"
                    className="text-base text-green-900"
                  >
                    Email:
                  </label>
                  <br />
                  <input
                    id="login-email"
                    name="login-email"
                    className="pl-1 focus:outline-none focus:border-sky-500 focus:invalid:border-red-600 border-2 rounded w-full peer"
                    data-cy="login-email"
                    type="text"
                    required
                    pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                    value={email}
                    onChange={handleChange(setEmail)}
                  />
                  <p className="invisible text-xs pl-1 pt-1 text-red-500">
                    Invalid email
                  </p>
                </div>

                <div
                  id="login-password-container"
                  className="mb-8 text-xl mx-auto w-full"
                >
                  <label
                    htmlFor="login-password"
                    className="text-base text-green-900"
                  >
                    Password:
                  </label>
                  <br />
                  <input
                    id="login-password"
                    name="login-password"
                    className="pl-1 focus:outline-none focus:border-sky-500 focus:invalid:border-red-600 border-2 rounded w-full"
                    data-cy="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={handleChange(setPassword)}
                  />
                  <p className="invisible text-xs pl-1 pt-1 text-red-500">
                    Invalid email
                  </p>
                </div>

                <div className="flex flex-row justify-between items-center">
                  <input
                    id="login-submit"
                    className="btn bg-green-900 border-0 hover:bg-green-700 rounded-full"
                    data-cy="login-submit"
                    type="submit"
                    value="submit"
                  />
                  <a href="/signup" className="ml-6 text-green-900">
                    Don't have an account?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

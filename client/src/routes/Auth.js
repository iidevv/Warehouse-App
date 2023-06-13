import React, { createRef, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { instance } from "../api/api";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
export const Auth = () => {
  return (
    <div className="auth">
      <Login />
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const recaptchaRef = createRef();
  const navigate = useNavigate();

  const handleRecaptcha = (value) => {
    setRecaptchaValue(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (recaptchaValue === null || recaptchaValue === "") {
      setResponse("Please complete the reCAPTCHA!");
      return;
    }

    try {
      const result = await instance.post("/auth/login", {
        username,
        password,
        recaptcha: recaptchaValue,
      });
      Cookies.set("userID", result.data.userID, { expires: 2 });
      setResponse("Logged in!");
      navigate("/");

      recaptchaRef.current.reset();
      setRecaptchaValue(null);
    } catch (error) {
      setResponse(error.response.data.message);

      recaptchaRef.current.reset();
      setRecaptchaValue(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="https://discountmotogear.com/"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
      >
        <img src={logo} alt="DMG" />
      </a>
      <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-sm xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@company.com"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LdSXJUmAAAAACUk8ulNciHxO57BKlLvuOOzNRxx"
              onChange={handleRecaptcha}
            />
            <button
              type="submit"
              className=" text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center"
            >
              Sign in
            </button>
            <p className="border-t pt-1 mt-1 text-gray-600">
              {response}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

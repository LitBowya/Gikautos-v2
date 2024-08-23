import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash, FaCog } from "react-icons/fa";

import Loader from "../components/Loader/Loader";
import LoginCss from "./LoginPage.module.css";

import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const handleInputFocus = (input) => {
    setFocusedInput(input);
    setIsTyping(true);
  };

  const handleInputBlur = (e, input) => {
    setFocusedInput(e.target.value !== "" ? input : null);
    setIsTyping(e.target.value !== "");
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className={LoginCss.login}>
      <div className={LoginCss.left}>
        <img src="/images/SignUp/mechanics.jpg" alt="Login Visual" />
        <div className={LoginCss.leftText}>
          <h1>
            <span>Rev</span> Up Your Account
          </h1>
          <p>
            Your <span>gateway</span> to premium auto parts
          </p>
        </div>
      </div>
      <div className={LoginCss.right}>
        <form onSubmit={submitHandler} className={LoginCss.form}>
          <h1>Log In</h1>
          <div className={LoginCss.inputContainer}>
            <input
              id="email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleInputFocus("email")}
              onBlur={(e) => handleInputBlur(e, "email")}
              className={LoginCss.inputField}
            />
            <span
              className={`${LoginCss.placeholder} ${
                focusedInput === "email" || email ? LoginCss.shrink : ""
              }`}
            >
              Enter email
            </span>
          </div>

          <div className={LoginCss.inputContainer}>
            <input
              id="password"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleInputFocus("password")}
              onBlur={(e) => handleInputBlur(e, "password")}
              className={LoginCss.inputField}
            />
            <span
              className={`${LoginCss.placeholder} ${
                focusedInput === "password" || password ? LoginCss.shrink : ""
              }`}
            >
              Enter password
            </span>
            <button
              type="button"
              className={LoginCss.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className={LoginCss.button}>
            <button
              disabled={isLoading}
              type="submit"
              className={LoginCss.submitButton}
            >
              Sign In
            </button>
          </div>

          {isLoading && <Loader />}
        </form>
        <div
          className={`${LoginCss.gearIcon} ${
            isTyping ? LoginCss.slideRotate : ""
          }`}
        >
          <FaCog />
        </div>
        <div className={LoginCss.registerLink}>
          <p>
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

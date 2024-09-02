import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";

import {
  useRegisterMutation,
  useUploadProfilePictureMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

import RegisterCss from "./RegisterPage.module.css";
import { FaCog } from "react-icons/fa";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePic] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMechanic, setIsMechanic] = useState(false);
  const [mechanicDetails, setMechanicDetails] = useState({
    specialty: "",
    experience: 0,
    shopName: "",
    shopAddress: {
      region: "",
      city: "",
      town: "",
      location: "",
    },
    workingHours: "",
    mechanicProfilePicture: "",
    contactNumber: "",
    servicesProvided: [],
    availableDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    additionalInfo: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();


  const [isTyping, setIsTyping] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const [uploadProfilePicture, { isLoading: loadingUpload }] =
    useUploadProfilePictureMutation();

  const uploadProfileFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
        const res = await uploadProfilePicture(formData).unwrap();
      toast.success(res.message);
      setProfilePic(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadMechanicProfileFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProfilePicture(formData).unwrap();
      toast.success(res.message);
      setMechanicDetails({
        ...mechanicDetails,
        mechanicProfilePicture: res.image,
      });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({
          name,
          username,
          email,
          password,
          profilePicture,
          isMechanic,
          mechanicDetails: isMechanic ? mechanicDetails : null,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/login");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleInputFocus = (input) => {
    setFocusedInput(input);
    setIsTyping(true);
  };

  const handleInputBlur = (e, input) => {
    setFocusedInput(e.target.value !== "" ? input : null);
    setIsTyping(e.target.value !== "");
  };

  return (
    <div className={RegisterCss.register}>
      <div className={RegisterCss.left}>
        <div className={RegisterCss.formWrapper}>
          <h1 className={`text-center`}>Register</h1>
          <Form onSubmit={submitHandler} className={RegisterCss.form}>
            <div className={RegisterCss.inputContainer}>
              <input
                id="name"
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => handleInputFocus("name")}
                onBlur={(e) => handleInputBlur(e, "name")}
                className={RegisterCss.inputField}
              />
              <span
                className={`${RegisterCss.placeholder} ${
                  focusedInput === "name" || name ? RegisterCss.shrink : ""
                }`}
              >
                Enter name
              </span>
            </div>

            <div className={RegisterCss.inputContainer}>
              <input
                id="username"
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => handleInputFocus("username")}
                onBlur={(e) => handleInputBlur(e, "username")}
                className={RegisterCss.inputField}
              />
              <span
                className={`${RegisterCss.placeholder} ${
                  focusedInput === "username" || username
                    ? RegisterCss.shrink
                    : ""
                }`}
              >
                Enter username
              </span>
            </div>

            <div className={RegisterCss.inputContainer}>
              <input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => handleInputFocus("email")}
                onBlur={(e) => handleInputBlur(e, "email")}
                className={RegisterCss.inputField}
              />
              <span
                className={`${RegisterCss.placeholder} ${
                  focusedInput === "email" || email ? RegisterCss.shrink : ""
                }`}
              >
                Enter email
              </span>
            </div>

            <div className={RegisterCss.inputContainer}>
              <input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => handleInputFocus("password")}
                onBlur={(e) => handleInputBlur(e, "password")}
                className={RegisterCss.inputField}
              />
              <span
                className={`${RegisterCss.placeholder} ${
                  focusedInput === "password" || password
                    ? RegisterCss.shrink
                    : ""
                }`}
              >
                Enter password
              </span>
            </div>

            <div className={RegisterCss.inputContainer}>
              <input
                id="confirmPassword"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => handleInputFocus("confirmPassword")}
                onBlur={(e) => handleInputBlur(e, "confirmPassword")}
                className={RegisterCss.inputField}
              />
              <span
                className={`${RegisterCss.placeholder} ${
                  focusedInput === "confirmPassword" || confirmPassword
                    ? RegisterCss.shrink
                    : ""
                }`}
              >
                Confirm password
              </span>
            </div>

            <Form.Group controlId="profilePic">
              <Form.Label>Profile Pic</Form.Label>
              <Form.Control
                required
                type="file"
                onChange={uploadProfileFileHandler}
              />
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId="isMechanic">
              <Form.Check
                type="checkbox"
                label="Are you a mechanic?"
                checked={isMechanic}
                onChange={(e) => setIsMechanic(e.target.checked)}
              />
            </Form.Group>

            {/* mechanic field  */}

            <div className={RegisterCss.mechanicDetails}>
              {/* Image Upload */}
              {isMechanic && (
                <>
                  <div className={RegisterCss.inputContainer}>
                    <label
                      htmlFor="mechanicProfilePicture"
                      className={RegisterCss.label}
                    >
                      Your Image
                    </label>
                    <input
                      id="mechanicProfilePicture"
                      type="file"
                      onChange={uploadMechanicProfileFileHandler}
                      className={RegisterCss.inputField}
                    />
                    {loadingUpload && <Loader />}
                  </div>

                  {/* Specialty */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="specialty"
                      required
                      type="text"
                      value={mechanicDetails.specialty}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          specialty: e.target.value,
                        })
                      }
                      onFocus={() => handleInputFocus("specialty")}
                      onBlur={(e) => handleInputBlur(e, "specialty")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "specialty" ||
                        mechanicDetails.specialty
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      Enter your specialty
                    </span>
                  </div>

                  {/* Experience */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="experience"
                      required
                      type="number"
                      value={mechanicDetails.experience}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          experience: e.target.value,
                        })
                      }
                      onFocus={() => handleInputFocus("experience")}
                      onBlur={(e) => handleInputBlur(e, "experience")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "experience" ||
                        mechanicDetails.experience
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      Years of Experience
                    </span>
                  </div>

                  {/* Phone Contact */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="contactNumber"
                      required
                      type="number"
                      value={mechanicDetails.contactNumber}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          contactNumber: e.target.value,
                        })
                      }
                      onFocus={() => handleInputFocus("contactNumber")}
                      onBlur={(e) => handleInputBlur(e, "contactNumber")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "contactNumber" ||
                        mechanicDetails.contactNumber
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      Enter Your Phone Number
                    </span>
                  </div>

                  {/* Shop Address Region */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="shopAddressRegion"
                      required
                      type="text"
                      value={mechanicDetails.shopAddress.region}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          shopAddress: {
                            ...mechanicDetails.shopAddress,
                            region: e.target.value,
                          },
                        })
                      }
                      onFocus={() => handleInputFocus("shopAddressRegion")}
                      onBlur={(e) => handleInputBlur(e, "shopAddressRegion")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "shopAddressRegion" ||
                        mechanicDetails.shopAddressRegion
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      Which Region Is The Shop Located
                    </span>
                  </div>

                  {/* Shop Address City */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="shopAddressCity"
                      required
                      type="text"
                      value={mechanicDetails.shopAddress.city}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          shopAddress: {
                            ...mechanicDetails.shopAddress,
                            city: e.target.value,
                          },
                        })
                      }
                      onFocus={() => handleInputFocus("shopAddressCity")}
                      onBlur={(e) => handleInputBlur(e, "shopAddressCity")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "shopAddressCity" ||
                        mechanicDetails.shopAddressCity
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      Which City Is The Shop Located
                    </span>
                  </div>

                  {/* Shop Address Town */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="shopAddressTown"
                      required
                      type="text"
                      value={mechanicDetails.shopAddress.town}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          shopAddress: {
                            ...mechanicDetails.shopAddress,
                            town: e.target.value,
                          },
                        })
                      }
                      onFocus={() => handleInputFocus("shopAddressTown")}
                      onBlur={(e) => handleInputBlur(e, "shopAddressTown")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "shopAddressTown" ||
                        mechanicDetails.shopAddressTown
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      Which Town Is The Shop Located
                    </span>
                  </div>

                  {/* Shop Address Location */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="shopAddressLocation"
                      required
                      type="text"
                      value={mechanicDetails.shopAddress.location}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          shopAddress: {
                            ...mechanicDetails.shopAddress,
                            location: e.target.value,
                          },
                        })
                      }
                      onFocus={() => handleInputFocus("shopAddressLocation")}
                      onBlur={(e) => handleInputBlur(e, "shopAddressLocation")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "shopAddressLocation" ||
                        mechanicDetails.shopAddressLocation
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      Which Location Is The Shop Located
                    </span>
                  </div>

                  {/* Shop Name */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="shopName"
                      required
                      type="text"
                      value={mechanicDetails.shopName}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          shopName: e.target.value,
                        })
                      }
                      onFocus={() => handleInputFocus("shopName")}
                      onBlur={(e) => handleInputBlur(e, "shopName")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "shopName" || mechanicDetails.shopName
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      What Is The Name Of Your Shop
                    </span>
                  </div>

                  {/* Working Hours */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="workingHours"
                      required
                      type="text"
                      value={mechanicDetails.workingHours}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          workingHours: e.target.value,
                        })
                      }
                      onFocus={() => handleInputFocus("workingHours")}
                      onBlur={(e) => handleInputBlur(e, "workingHours")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "workingHours" ||
                        mechanicDetails.workingHours
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      Enter Your Working Hours
                    </span>
                  </div>

                  {/* Services Provided */}
                  <div className={RegisterCss.inputContainer}>
                    <input
                      id="servicesProvided"
                      required
                      type="text"
                      value={mechanicDetails.servicesProvided.join(", ")}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          servicesProvided: e.target.value
                            .split(",")
                            .map((service) => service.trim()),
                        })
                      }
                      onFocus={() => handleInputFocus("servicesProvided")}
                      onBlur={(e) => handleInputBlur(e, "servicesProvided")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "servicesProvided" ||
                        mechanicDetails.servicesProvided
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      Enter Services Provided (comma separated)
                    </span>
                  </div>

                  {/* Available Days */}
                  <div className={RegisterCss.inputContainer}>
                    <label className={RegisterCss.label}>Available Days</label>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <div key={day} className={RegisterCss.checkboxContainer}>
                        <input
                          type="checkbox"
                          id={day}
                          checked={
                            mechanicDetails.availableDays[day.toLowerCase()]
                          }
                          onChange={(e) =>
                            setMechanicDetails({
                              ...mechanicDetails,
                              availableDays: {
                                ...mechanicDetails.availableDays,
                                [day.toLowerCase()]: e.target.checked,
                              },
                            })
                          }
                          className={RegisterCss.checkbox}
                        />
                        <label
                          htmlFor={day}
                          className={RegisterCss.checkboxLabel}
                        >
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className={RegisterCss.inputContainer}>
                    <textarea
                      id="additionalInfo"
                      value={mechanicDetails.additionalInfo}
                      onChange={(e) =>
                        setMechanicDetails({
                          ...mechanicDetails,
                          additionalInfo: e.target.value,
                        })
                      }
                      onFocus={() => handleInputFocus("additionalInfo")}
                      onBlur={(e) => handleInputBlur(e, "additionalInfo")}
                      className={RegisterCss.inputField}
                    />
                    <span
                      className={`${RegisterCss.placeholder} ${
                        focusedInput === "additionalInfo" ||
                        mechanicDetails.additionalInfo
                          ? RegisterCss.shrink
                          : ""
                      }`}
                    >
                      What Additional Info Can You Give Us
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className={RegisterCss.button}>
              <Button
                disabled={isLoading}
                type="submit"
                className={RegisterCss.submitButton}
              >
                Register
              </Button>
            </div>

            {isLoading && <Loader />}

            <div
              className={`${RegisterCss.gearIcon} ${
                isTyping ? RegisterCss.slideRotate : ""
              }`}
            >
              <FaCog />
            </div>
          </Form>
        </div>

        <div className={RegisterCss.registerLink}>
          <p>
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className={RegisterCss.right}>
        <img src="/images/SignUp/mechanics.jpg" alt="Mechanics" />
        <div className={RegisterCss.rightText}>
          <h1>
            <span>Spark</span> Your Journey
          </h1>
          <p>
            <span>Ignite</span> your account for a world of quality car
            components.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

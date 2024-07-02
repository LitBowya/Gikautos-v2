import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";
import FormContainer from "../components/Form/FormContainer";

import {
  useRegisterMutation,
  useUploadProfilePictureMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

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

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

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
        navigate(redirect);
      } catch (err) {
        console.log(err?.data?.message || err.error);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="my-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="profilePic">
          <Form.Label>Profile Pic</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Upload an image for profile picture"
            value={profilePicture}
            onChange={(e) => setProfilePic(e.target.value)}
          />
          <Form.Control
            required
            label="Choose File"
            onChange={uploadProfileFileHandler}
            type="file"
          />
          {loadingUpload && <Loader />}
        </Form.Group>

        <Form.Group controlId="isMechanic" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Are you a mechanic?"
            checked={isMechanic}
            onChange={(e) => setIsMechanic(e.target.checked)}
          />
        </Form.Group>

        {isMechanic && (
          <div>
            <Form.Group className="mb-3" controlId="mechanicProfilePic">
              <Form.Label>Your Picture</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Upload an image for your picture"
                value={mechanicDetails.mechanicProfilePicture}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    mechanicProfilePicture: e.target.value,
                  })
                }
              />
              <Form.Control
                required
                label="Choose File"
                onChange={uploadMechanicProfileFileHandler}
                type="file"
              />
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group className="my-2" controlId="specialty">
              <Form.Label>Specialty</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your specialty"
                value={mechanicDetails.specialty}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    specialty: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="experience">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Years Of Experience"
                value={mechanicDetails.experience}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    experience: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="contactNumber">
              <Form.Label>Phone Contact</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Phone Contact"
                value={mechanicDetails.contactNumber}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    contactNumber: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="shopAddressRegion">
              <Form.Label>Shop Address Region</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter shop address region"
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
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="shopAddressCity">
              <Form.Label>Shop Address City</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter shop address city"
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
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="shopAddressTown">
              <Form.Label>Shop Address Town</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter shop address town"
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
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="shopAddressLocation">
              <Form.Label>Shop Address Location</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter shop address location"
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
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="shopName">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Name of your shop"
                value={mechanicDetails.shopName}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    shopName: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="workingHours">
              <Form.Label>Working Hours</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Working Hours"
                value={mechanicDetails.workingHours}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    workingHours: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="servicesProvided" className="my-2">
              <Form.Label>Services Provided</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter services provided (comma separated)"
                value={mechanicDetails.servicesProvided.join(", ")}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    servicesProvided: e.target.value
                      .split(",")
                      .map((service) => service.trim()),
                  })
                }
              />
            </Form.Group>

            <Form.Group controlId="availableDays" className="my-2">
              <Form.Label>Available Days</Form.Label>
              <Row>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="Monday"
                    checked={mechanicDetails.availableDays.monday}
                    onChange={(e) =>
                      setMechanicDetails({
                        ...mechanicDetails,
                        availableDays: {
                          ...mechanicDetails.availableDays,
                          monday: e.target.checked,
                        },
                      })
                    }
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="Tuesday"
                    checked={mechanicDetails.availableDays.tuesday}
                    onChange={(e) =>
                      setMechanicDetails({
                        ...mechanicDetails,
                        availableDays: {
                          ...mechanicDetails.availableDays,
                          tuesday: e.target.checked,
                        },
                      })
                    }
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="Wednesday"
                    checked={mechanicDetails.availableDays.wednesday}
                    onChange={(e) =>
                      setMechanicDetails({
                        ...mechanicDetails,
                        availableDays: {
                          ...mechanicDetails.availableDays,
                          wednesday: e.target.checked,
                        },
                      })
                    }
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="Thursday"
                    checked={mechanicDetails.availableDays.thursday}
                    onChange={(e) =>
                      setMechanicDetails({
                        ...mechanicDetails,
                        availableDays: {
                          ...mechanicDetails.availableDays,
                          thursday: e.target.checked,
                        },
                      })
                    }
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="Friday"
                    checked={mechanicDetails.availableDays.friday}
                    onChange={(e) =>
                      setMechanicDetails({
                        ...mechanicDetails,
                        availableDays: {
                          ...mechanicDetails.availableDays,
                          friday: e.target.checked,
                        },
                      })
                    }
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="Saturday"
                    checked={mechanicDetails.availableDays.saturday}
                    onChange={(e) =>
                      setMechanicDetails({
                        ...mechanicDetails,
                        availableDays: {
                          ...mechanicDetails.availableDays,
                          saturday: e.target.checked,
                        },
                      })
                    }
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="Sunday"
                    checked={mechanicDetails.availableDays.sunday}
                    onChange={(e) =>
                      setMechanicDetails({
                        ...mechanicDetails,
                        availableDays: {
                          ...mechanicDetails.availableDays,
                          sunday: e.target.checked,
                        },
                      })
                    }
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="additionalInfo" className="my-2">
              <Form.Label>Additional Info, Optional</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Write something about yourself"
                value={mechanicDetails.additionalInfo}
                onChange={(e) =>
                  setMechanicDetails({
                    ...mechanicDetails,
                    additionalInfo: e.target.value,
                  })
                }
              />
            </Form.Group>
          </div>
        )}

        <Button disabled={isLoading} type="submit" variant="primary">
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterPage;


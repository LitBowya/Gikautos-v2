import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import FormContainer from "../components/Form/FormContainer";
import CheckoutSteps from "../components/Checkout Steps/CheckoutSteps";
import ShippingCss from "./ShippingPage.module.css";

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || ""
  );
  const [otherPhoneNumber, setOtherPhoneNumber] = useState(
    shippingAddress?.otherPhoneNumber || ""
  );
  const [additionalInformation, setAdditionalInformation] = useState(
    shippingAddress?.additionalInformation || ""
  );
  const [region, setRegion] = useState(shippingAddress?.region || "");

  const [focusedInput, setFocusedInput] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingAddress({
        address,
        city,
        otherPhoneNumber,
        phoneNumber,
        additionalInformation,
        region,
      })
    );
    navigate("/payment");
  };

  const handleInputFocus = (input) => {
    setFocusedInput(input);
  };

  const handleInputBlur = (e, input) => {
    setFocusedInput(e.target.value !== "" ? input : null);
  };

  return (
    <div className={ShippingCss.shipping}>
      <div className={ShippingCss.left}>
        <img src="/images/ShopPage/shipping.jpg" alt="Shipping Visual" />
              <div className={ShippingCss.leftText}>
                  <FaCartPlus size={50} className={ShippingCss.icon} />
          <h1>
            <span>Fast</span> Delivery
          </h1>
          <p>
            Your <span>gateway</span> to swift shipping
          </p>
        </div>
      </div>
      <div className={ShippingCss.right}>
        <FormContainer>
          <CheckoutSteps step1 step2 />

          <Form onSubmit={submitHandler} className={ShippingCss.form}>
            <h1>Shipping</h1>
            {[
              {
                id: "phoneNumber",
                label: "Phone Number",
                value: phoneNumber,
                setter: setPhoneNumber,
              },
              {
                id: "otherPhoneNumber",
                label: "Other Phone Number",
                value: otherPhoneNumber,
                setter: setOtherPhoneNumber,
              },
              {
                id: "region",
                label: "Region",
                value: region,
                setter: setRegion,
              },
              { id: "city", label: "City", value: city, setter: setCity },
              {
                id: "address",
                label: "GP Address",
                value: address,
                setter: setAddress,
              },
              {
                id: "additionalInformation",
                label: "Additional Information",
                value: additionalInformation,
                setter: setAdditionalInformation,
              },
            ].map(({ id, label, value, setter }) => (
              <div className={ShippingCss.inputContainer} key={id}>
                <input
                  id={id}
                  required
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  onFocus={() => handleInputFocus(id)}
                  onBlur={(e) => handleInputBlur(e, id)}
                  className={ShippingCss.inputField}
                />
                <span
                  className={`${ShippingCss.placeholder} ${
                    focusedInput === id || value ? ShippingCss.shrink : ""
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}

            <Button type="submit" className={ShippingCss.submitButton}>
              Continue
            </Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
};

export default ShippingPage;

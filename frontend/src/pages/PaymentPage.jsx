import { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/Form/FormContainer";
import CheckoutSteps from "../components/Checkout Steps/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";
import PaymentPageCss from "./PaymentPage.module.css";
import { FaCcVisa, FaMoneyBillWave } from "react-icons/fa"; // Icons for payment methods

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState("PayStack");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <div className={PaymentPageCss.paymentScreen}>
<Form onSubmit={submitHandler} className={PaymentPageCss.formContainer}>
          <h3 className={PaymentPageCss.paymentTitle}>Payment Method</h3>
          <Form.Group>
            <Col>
              <div className={PaymentPageCss.radioGroup}>
                <label className={PaymentPageCss.radioLabel}>
                  <Form.Check
                    type="radio"
                    label={
                      <>
                        <FaCcVisa className={PaymentPageCss.radioIcon} />{" "}
                        Card Or Momo
                      </>
                    }
                    id="PayStack"
                    name="paymentMethod"
                    value="PayStack"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={PaymentPageCss.radioInput}
                  />
                </label>
                <label className={PaymentPageCss.radioLabel}>
                  <Form.Check
                    type="radio"
                    label={
                      <>
                        <FaMoneyBillWave className={PaymentPageCss.radioIcon} />{" "}
                        On Delivery
                      </>
                    }
                    id="On Delivery"
                    name="paymentMethod"
                    value="On Delivery"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={PaymentPageCss.radioInput}
                  />
                </label>
              </div>
            </Col>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className={PaymentPageCss.submitButton}
          >
            Continue
          </Button>
        </Form>
      </div>
    </FormContainer>
  );
};

export default PaymentScreen;

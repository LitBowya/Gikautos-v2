import express from "express";
import initializePayment from "../controllers/paymentController.js";

const router = express.Router();

router.post("/acceptpayment", initializePayment.acceptPayment);
router.get("/verifypayment/:reference", initializePayment.verifyPayment);
router.get("/getpayment", initializePayment.getAllPayments);

export default router;

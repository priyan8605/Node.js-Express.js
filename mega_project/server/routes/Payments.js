const express = require("express");
const router = express.Router();
const { capturePayment, verifySignature} = require("../controllers/Payments");

const { auth, isStudent } = require("../middlewares/Auth");
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifySignature);
// router.post(
//   "/sendPaymentSuccessEmail",
//   auth,
//   isStudent,
//   sendPaymentSuccessEmail
// );

module.exports = router;
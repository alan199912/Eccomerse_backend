const express = require('express');
const { cancelPayment, capturePayment } = require('../controllers/payment');

const router = express.Router();

router.get('/capture/:orderId/:userId/:roleId', capturePayment);
router.get('/cancel', cancelPayment);

module.exports = router;

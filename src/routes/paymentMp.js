const express = require('express');
const { capturePayment } = require('../controllers/paymentMP');

const router = express.Router();

router.get('/capture/:orderId/:userId/:roleId', capturePayment);

module.exports = router;

const express = require('express');
const { contactUs } = require('../controllers/contactUs');

const router = express.Router();

router.post('/email', contactUs);

module.exports = router;

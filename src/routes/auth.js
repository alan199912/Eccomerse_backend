const express = require('express');
const {
  registerUser,
  loginUser,
  verifyAuth,
  verifyAdminAuth,
  recoveryPassword,
  confirmationEmail,
  restorePasswordEmail,
  unsubscribeAccount,
  getIdByToken,
  verifyEncodeToken,
} = require('../controllers/auth');
const { validateJWT } = require('../middlewares/jwt');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifyAuth', [validateJWT], verifyAuth);
router.get('/verifyAdminAuth', [validateJWT], verifyAdminAuth);
router.post('/recoveryPassword', recoveryPassword);
router.put('/restorePassword/:encodeToken', restorePasswordEmail);
router.get('/confirmationEmail/:encodeToken', confirmationEmail);
router.get('/unsubscribeAccount/:encodeToken', unsubscribeAccount);
router.get('/getIdByToken', [validateJWT], getIdByToken);
router.post('/verifyEncodeToken', verifyEncodeToken);

module.exports = router;

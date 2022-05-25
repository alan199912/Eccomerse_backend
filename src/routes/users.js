const express = require('express');
const {
  getUserById,
  setUser,
  getUserList,
  deleteUser,
  restoreUser,
  updateUser,
  changePasswordUser,
  getAllDataUserById,
  updateAllDataUser,
} = require('../controllers/user');
const { validateJWT, validateAdminJWT } = require('../middlewares/jwt');

const router = express.Router();

router.get('/getUserById/:id', [validateJWT], getUserById);
router.get('/getAllDataUserById/:id', [validateAdminJWT], getAllDataUserById);
router.post('/setUser', [validateAdminJWT], setUser);
router.get('/getUserList', [validateAdminJWT], getUserList);
router.delete('/deleteUser/:id', [validateAdminJWT], deleteUser);
router.post('/restoreUser/:id', [validateAdminJWT], restoreUser);
router.put('/updateUser/:id', [validateJWT], updateUser);
router.put('/changePasswordUser/:id', [validateJWT], changePasswordUser);
router.put('/updateAllDataUser/:id', [validateAdminJWT], updateAllDataUser);

module.exports = router;

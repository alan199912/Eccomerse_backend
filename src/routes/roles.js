const express = require('express');
const {
  setRole,
  getRolesList,
  getRoleById,
  deleteRole,
  restoreRole,
  updateRole,
  getRolesListEnabled,
} = require('../controllers/role');
const { validateAdminJWT } = require('../middlewares/jwt');

const router = express.Router();

router.post('/setRole', [validateAdminJWT], setRole);
router.get('/getRolesList', [validateAdminJWT], getRolesList);
router.get('/getRoleById/:id', [validateAdminJWT], getRoleById);
router.get('/getRolesListEnabled', [validateAdminJWT], getRolesListEnabled);
router.delete('/deleteRole/:id', [validateAdminJWT], deleteRole);
router.post('/restoreRole/:id', [validateAdminJWT], restoreRole);
router.put('/updateRole/:id', [validateAdminJWT], updateRole);

module.exports = router;

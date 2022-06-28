const express = require('express');
const { setMainImageProduct, updateMainImageProduct } = require('../controllers/mainProductImage');
const uploadOptions = require('../helpers/uploadOptions');
const { validateJWT, validateAdminJWT } = require('../middlewares/jwt');

const router = express.Router();

router.post('/setMainImage', [validateAdminJWT, uploadOptions.single('image')], setMainImageProduct);
router.put(
  '/updateMainImage/:id',
  [validateAdminJWT, uploadOptions.single('image')],
  updateMainImageProduct
);

module.exports = router;

const express = require('express');
const { setRestImageProduct, updateRestImagesProduct } = require('../controllers/restProductImage');
const uploadOptions = require('../helpers/uploadOptions');
const { validateJWT, validateAdminJWT } = require('../middlewares/jwt');

const router = express.Router();

router.post('/setRestImage', [validateAdminJWT, uploadOptions.array('images')], setRestImageProduct);
router.put(
  '/updateRestImage/:id',
  [validateAdminJWT, uploadOptions.array('images')],
  updateRestImagesProduct
);

module.exports = router;

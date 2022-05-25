const express = require('express');
const {
  setMainImageProduct,
  // getMainImagesList,
  // getMainImagesById,
  // updateMainImages,
  // deleteMainImages,
  // restoreMainImages,
} = require('../controllers/mainProductImage');
const uploadOptions = require('../helpers/uploadOptions');
const { validateJWT, validateAdminJWT } = require('../middlewares/jwt');

const router = express.Router();

router.post('/setMainImage', [validateAdminJWT, uploadOptions.single('image')], setMainImageProduct);
// router.get('/productList', [validateJWT], getProductsList);
// router.get('/getProductById/:id', [validateJWT], getProductById);
// router.put(
//   '/updateProduct/:id',
//   [
//     validateAdminJWT,
//     uploadOptions.fields([
//       { name: 'image', maxCount: 1 },
//       { name: 'images', maxCount: 3 },
//     ]),
//   ],
//   updateProduct
// );
// router.delete('/deleteProduct/:id', [validateAdminJWT], deleteProduct);
// router.post('/restoreProduct/:id', [validateAdminJWT], restoreProduct);

module.exports = router;

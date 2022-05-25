const express = require('express');
const {
  setRestImageProduct,
  // getRestImagesList,
  // getRestImagesById,
  // updateRestImages,
  // deleteRestImages,
  // restoreRestImages,
} = require('../controllers/restProductImage');
const uploadOptions = require('../helpers/uploadOptions');
const { validateJWT, validateAdminJWT } = require('../middlewares/jwt');

const router = express.Router();

router.post('/setRestImage', [validateAdminJWT, uploadOptions.array('images')], setRestImageProduct);
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

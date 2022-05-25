const express = require('express');
const {
  setProduct,
  getProductsList,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getCountProducts,
  getFeaturedProducts,
  getProductByCategoryId,
  getFeaturedProductByCategoryId,
  getLatestProductInEachCategoryByLimit,
  getProductsListSortBy,
  getProductsListPagination,
  getProductsByName,
  getProductsListByCategoryIdPagination,
} = require('../controllers/product');
const uploadOptions = require('../helpers/uploadOptions');
const { validateJWT, validateAdminJWT } = require('../middlewares/jwt');

const router = express.Router();

router.post(
  '/setProduct',
  [
    validateAdminJWT,
    uploadOptions.fields([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
  ],
  setProduct
);
router.get('/productList', [validateJWT], getProductsList);
router.get('/getProductById/:id', [validateJWT], getProductById);
router.put(
  '/updateProduct/:id',
  [
    validateAdminJWT,
    uploadOptions.fields([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]),
  ],
  updateProduct
);
router.delete('/deleteProduct/:id', [validateAdminJWT], deleteProduct);
router.post('/restoreProduct/:id', [validateAdminJWT], restoreProduct);
router.get('/getCountProducts', [validateJWT], getCountProducts);
router.get('/getFeaturedProducts/:limit', [validateJWT], getFeaturedProducts);
router.get('/getProductByCategoryId', [validateJWT], getProductByCategoryId);
router.get(
  '/getFeaturedProductByCategoryId/:categoryId/:limit',
  [validateJWT],
  getFeaturedProductByCategoryId
);
router.get(
  '/getLatestProductInEachCategoryByLimit/:limit',
  [validateJWT],
  getLatestProductInEachCategoryByLimit
);
router.get('/getProductsListSortBy/:sortBy', [validateJWT], getProductsListSortBy);
router.get('/getProductsListPagination', [validateJWT], getProductsListPagination);
router.get('/getProductsByName', [validateJWT], getProductsByName);
router.get(
  '/getProductsListByCategoryIdPagination/:id',
  [validateJWT],
  getProductsListByCategoryIdPagination
);

module.exports = router;

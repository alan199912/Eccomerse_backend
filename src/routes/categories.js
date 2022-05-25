const express = require('express');
const {
  setCategory,
  getCategoriesList,
  getCategoriesListIncludeDeleted,
  getCategoryById,
  deleteCategory,
  restoreCategory,
  updateCategory,
} = require('../controllers/category');
const { validateJWT, validateAdminJWT } = require('../middlewares/jwt');

const router = express.Router();

router.post('/setCategory', [validateAdminJWT], setCategory);
router.get('/getCategoriesList', [validateJWT], getCategoriesList);
router.get('/getCategoriesListIncludeDeleted', [validateAdminJWT], getCategoriesListIncludeDeleted);
router.get('/getCategoryById/:id', [validateJWT], getCategoryById);
router.delete('/deleteCategory/:id', [validateAdminJWT], deleteCategory);
router.post('/restoreCategory/:id', [validateAdminJWT], restoreCategory);
router.put('/updateCategory/:id', [validateAdminJWT], updateCategory);

module.exports = router;

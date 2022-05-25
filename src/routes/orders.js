const express = require('express');
const {
  setOrder,
  getOrdersList,
  getOrderById,
  updateOrder,
  deleteOrder,
  restoreOrder,
  getTotalSales,
  getOrdersByUserId,
} = require('../controllers/order');
const { validateJWT } = require('../middlewares/jwt');

const router = express.Router();

router.post('/setOrder', [validateJWT], setOrder);
router.get('/getOrdersList', [validateJWT], getOrdersList);
router.get('/getOrderById/:id', [validateJWT], getOrderById);
router.put('/updateOrder/:id', [validateJWT], updateOrder);
router.delete('/deleteOrder/:id', [validateJWT], deleteOrder);
router.post('/restoreOrder/:id', [validateJWT], restoreOrder);
router.get('/getTotalSales', [validateJWT], getTotalSales);
router.get('/getOrdersByUserId/:id', [validateJWT], getOrdersByUserId);

module.exports = router;

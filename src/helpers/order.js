const db = require('../models/index');

/**
 * Create order items and calculate total price of the each items
 * @param {Array} orderItems  quantity,productId
 * @param {Number} totalPrice
 * @returns items,total
 */
const createOrderItem = (orderItems, totalPrice) => {
  // Loop through order items and calculate total price of the order items
  return Promise.all(
    orderItems.map(async (item) => {
      // Verify if product exists
      const product = await db.Products.findOne({ where: { id: item.id } });

      if (!product) {
        return { status: 'error', message: 'Product not found' };
      }

      if (item.quantity <= 0) {
        return { status: 'error', message: 'Quantity must be greater than 0' };
      }

      totalPrice += product.price * item.quantity;

      console.log({ quantity: item.quantity, productId: item.id });

      const newOrderItem = await db.OrderItems.create({
        quantity: item.quantity,
        productId: item.id,
      });

      if (!newOrderItem) {
        return {
          status: 'error',
          message: 'Error creating an order item',
        };
      }

      return { items: newOrderItem.id, total: totalPrice };
    })
  );
};

module.exports = { createOrderItem };

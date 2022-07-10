require('dotenv').config();
const axios = require('axios');
const mercadopago = require('mercadopago');

/**
 * Generate MP access token
 */
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

/**
 * Create MP checkout order
 */
const createMPPayment = async (products, orderId, userId, roleId) => {
  const items = [];

  console.log({ products });

  products.forEach((product) =>
    items.push({
      title: product.name,
      unit_price: product.price,
      quantity: product.quantity,
    })
  );

  console.log({ items });

  try {
    const preference = {
      items,
      back_urls: {
        success: `http://localhost:5000/api/v1/paymentMP/capture/${orderId}/${userId}/${roleId}`,
        failure: 'http://localhost:4200/dashboard/checkout/error',
        pending: 'http://localhost:4200/dashboard/cart',
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);

    console.log({ response });

    return response.body.sandbox_init_point; // SANDBOX
  } catch (error) {
    console.log({ error });
    console.log(error.message);
    return {
      status: 'error',
      message: error.message,
    };
  }
};

module.exports = { createMPPayment };

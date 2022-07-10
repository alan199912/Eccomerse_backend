require('dotenv').config();
const axios = require('axios');

/**
 * Generate token paypal
 */
const generateTokenPaypal = async () => {
  const body = new URLSearchParams({ grant_type: 'client_credentials' });

  const {
    data: { access_token },
  } = await axios.post(process.env.PAYPAL_API_TOKEN, body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_CLIENT_SECRET,
    },
  });

  return access_token;
};

/**
 * Create checkout order
 */
const createPayment = async (products, total, orderId, userId, roleId) => {
  const items = [];

  console.log({ products });

  products.forEach((product) =>
    items.push({
      name: product.name,
      unit_amount: { value: product.price, currency_code: 'USD' },
      quantity: product.quantity,
      sku: product.code,
    })
  );

  console.log({ items });

  try {
    const order = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total,
          },
          description: 'Products Eccomerce',
        },
      ],
      application_context: {
        brand_name: 'eccomerce',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `http://localhost:5000/api/v1/payment/capture/${orderId}/${userId}/${roleId}`, // todo: here
        cancel_url: 'http://localhost:5000/api/v1/payment/cancel',
      },
    };

    console.log({ order });

    const access_token = await generateTokenPaypal();

    const { data } = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return data.links[1].href;
  } catch (error) {
    console.log({ error });
    console.log(error.message);
    return {
      status: 'error',
      message: error.message,
    };
  }
};

module.exports = { generateTokenPaypal, createPayment };

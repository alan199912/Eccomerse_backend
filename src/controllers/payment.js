require('dotenv').config();
const axios = require('axios');
const { generateTokenPaypal } = require('../helpers/paypal');
const { generateTokenOutApplication } = require('../helpers/token');
const { getUserByEmail } = require('../helpers/user');

const capturePayment = async (req, res) => {
  const { token, PayerID } = req.query;
  const { orderId, userId, roleId } = req.params;

  if (!token || !PayerID) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing token or PayerID',
    });
  }

  const access_token = await generateTokenPaypal();

  const { data } = await axios.post(
    `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  if (data.status === 'COMPLETED') {
    try {
      const token = await generateTokenOutApplication(userId, roleId);

      await axios.put(
        `http://localhost:5000/api/v1/orders/updateOrder/${orderId}`,
        {
          status: data.status,
          transactionId: data.id,
          payerId: data.payer.payer_id,
          payerEmail: data.payer.email_address,
          orderPaypal: data.links[0].href,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // todo: generate email to order completed

      res.writeHead(302, {
        Location: 'http://localhost:4200/dashboard/checkout/complete',
      });
      return res.end();
    } catch (error) {
      console.log({ error: error.message });
      res.writeHead(302, {
        Location: 'http://localhost:4200/dashboard/checkout/error',
      });
      return res.end();
    }
  }
};

const cancelPayment = (req, res) => {
  res.writeHead(302, {
    Location: 'http://localhost:4200/dashboard/cart',
  });
  return res.end();
};

module.exports = { capturePayment, cancelPayment };

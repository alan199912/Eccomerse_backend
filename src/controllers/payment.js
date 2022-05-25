require('dotenv').config();
const axios = require('axios');
const { generateTokenPaypal } = require('../helpers/paypal');
const { generateTokenOutApplication } = require('../helpers/token');
const { getUserByEmail } = require('../helpers/user');

const capturePayment = async (req, res) => {
  const { token, PayerID } = req.query;

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

  console.log({ data });

  if (data.status === 'COMPLETED') {
    try {
      const user = await getUserByEmail(data.payer.email_address);

      // if (!user) {
      //   throw new Error('Error find user');
      // }

      const token = await generateTokenOutApplication(user.id, user.roleId);

      const responseOrder = await axios.get(
        `http://localhost:5000/api/v1/orders/getOrdersByUserId/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // if (!responseOrder.data.order) {
      //   throw new Error('Error find user');
      // }

      const order = responseOrder.data.order[responseOrder.data.order.length - 1];

      const updatedOrder = await axios.put(
        `http://localhost:5000/api/v1/orders/updateOrder/${order.id}`,
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

      // if (!updatedOrder.data) {
      //   throw new Error('not updated order');
      // }

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

require('dotenv').config();
const axios = require('axios');
const { generateTokenOutApplication } = require('../helpers/token');

const capturePayment = async (req, res) => {
  const { payment_id, status, merchant_account_id, external_reference } = req.query;
  const { orderId, userId, roleId } = req.params;
  console.log({ query: req.query });
  console.log({ orderId, userId, roleId });

  if (status === 'approved') {
    try {
      const token = await generateTokenOutApplication(userId, roleId);

      await axios.put(
        `http://localhost:5000/api/v1/orders/updateOrder/${orderId}`,
        {
          status: 'COMPLETE',
          transactionId: payment_id,
          payerId: merchant_account_id,
          payerEmail: '',
          orderPaypal: external_reference, // todo: change name orderPaypal to orderReference
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

module.exports = { capturePayment };

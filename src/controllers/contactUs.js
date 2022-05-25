const { sendEmailContactUs } = require('../helpers/email');

const contactUs = (req, res) => {
  const { formData } = req.body;

  console.log(formData);

  const message = sendEmailContactUs(formData);

  if (message) {
    return res.status(200).json({
      message: 'Email sent successfully',
    });
  }

  return res.status(500).json({
    message: 'Error sending email',
  });
};

module.exports = { contactUs };

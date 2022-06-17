require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const db = require('../models/index');

sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendEmailConfirmAccount = async (user) => {
  const encodeToken = await db.User.generateToken(user.id);

  const msg = {
    personalizations: [
      {
        to: [
          {
            email: user.email,
            name: user.name,
          },
        ],
        dynamic_template_data: {
          user: user.username,
          subject: `Hola ${user.username} ¡Bienvenido a Cosmo Group!`,
          confirmURL: `http://localhost:5000/api/v1/auth/confirmationEmail/${encodeToken}`,
          unsubscribe: `http://localhost:5000/api/v1/auth/unsubscribeAccount/${encodeToken}`,
        },
      },
    ],
    from: {
      email: 'socialcosmogroup@gmail.com',
      name: 'Cosmo Group',
    },
    template_id: process.env.TEMPLATE_CONFIRM_EMAIL.toString(),
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Message sent');
    })
    .catch((error) => {
      console.log(error);
      console.log({ e: error.body });
    });
};

const sendEmailRecoveryPassword = async (user) => {
  const encodeToken = await db.User.generateToken(user.id);
  const msg = {
    personalizations: [
      {
        to: [
          {
            email: user.email,
            name: user.username,
          },
        ],
        dynamic_template_data: {
          user: user.username,
          subject: `${user.username} Recupera tu contraseña`,
          recoverURL: `http://localhost:4200/restore-password/${encodeToken}`,
          unsubscribe: `http://localhost:5000/api/v1/auth/unsubscribeAccount/${encodeToken}`,
        },
      },
    ],
    from: {
      email: 'socialcosmogroup@gmail.com',
      name: 'Recupera tu contraseña',
    },
    template_id: process.env.TEMPLATE_RECOVERY_PASSWORD.toString(),
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Message sent');
    })
    .catch((error) => {
      console.log(error);
    });
};

const sendEmailContactUs = async (formData) => {
  const msg = {
    personalizations: [
      {
        to: [
          {
            email: 'info@cosmogrp.net',
            name: 'INFO Cosmo Group',
          },
        ],
        dynamic_template_data: {
          user: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      },
    ],
    from: {
      email: 'socialcosmogroup@gmail.com',
      name: 'INFO Cosmo Group',
    },
    template_id: process.env.TEMPLATE_CONTACT_US.toString(),
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Message sent');
      return true;
    })
    .catch((error) => {
      console.log(error);
      console.log({ e: error.body });

      return false;
    });
};

module.exports = {
  sendEmailConfirmAccount,
  sendEmailRecoveryPassword,
  sendEmailContactUs,
};

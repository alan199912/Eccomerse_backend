const db = require('../models/index');

const generateTokenOutApplication = async (id, roleId) => {
  try {
    const token = await db.User.generateToken(id, roleId);

    if (!token) {
      return {
        status: 'error',
        message: 'Token no found',
      };
    }

    return token;
  } catch (error) {
    console.log({ error });
    return {
      status: 'error',
      message: error.message,
    };
  }
};

module.exports = {
  generateTokenOutApplication,
};

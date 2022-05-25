const db = require('../models/index');

/**
 * Controller to get categories list
 */
const getUserByEmail = async (email) => {
  console.log({ email });
  const user = await db.User.findOne({
    where: { email },
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    return {
      status: 'error',
      message: 'Error find user',
    };
  }

  return user;
};

module.exports = { getUserByEmail };

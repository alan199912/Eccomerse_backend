const db = require('../models/index');
const { sendEmailConfirmAccount, sendEmailRecoveryPassword } = require('../helpers/email');
const jwt = require('jsonwebtoken');

/**
 * Controller to register a new user
 * - Verify if user is already registered
 */
const registerUser = async (req, res) => {
  const { username, email, password, country, phone, name, lastName } = req.body;

  if (!username || !email || !password || !country || !phone || !name || !lastName) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const verifyUser = await db.User.findOne({ include: db.User.associations.Role, where: { email } });

    if (verifyUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already registered',
      });
    }

    const user = await db.User.create({
      username,
      email,
      password,
      country,
      phone,
      name,
      lastName,
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Error creating user',
      });
    }

    sendEmailConfirmAccount(user);

    return res.status(200).json({
      status: 'success',
      message: 'User created successfully',
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET /api/auth/login
 * Controller to login a user
 * - Verify if user is not registered
 * - Verify user status
 * - Verify if user password is correct
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields are required',
    });
  }

  try {
    const user = await db.User.findOne({
      include: db.User.associations.Role,
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Unregistered user',
      });
    }

    if (user.status === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'User not confirmed',
      });
    }

    const validPassword = db.User.validPassword(password, user.dataValues.password);

    if (!validPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is incorrect',
      });
    }

    const token = await db.User.generateToken(user.id, user.roleId);

    return res.status(200).json({
      status: 'success',
      token,
      isAdmin: user.roleId === 1,
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET /api/auth/verifyAuth
 * Renew token
 */
const verifyAuth = async (req, res) => {
  const { id, roleId } = req.user;

  if (!id || !roleId) {
    return res.status(400).json({
      status: 'error',
      message: 'Id or role is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Id must be a number',
    });
  }

  try {
    const user = await db.User.findOne({
      include: db.User.associations.Role,
      where: { id },
      attributes: { exclude: ['password'] },
    });

    console.log({ user });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Unregistered user',
      });
    }

    const token = await db.User.generateToken(user.id, user.roleId);

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Token no found',
      });
    }

    if (user.roleId === 1) {
      return res.status(400).json({
        status: 'error',
        message: 'User is not a default user',
      });
    }

    return res.status(200).json({
      status: 'success',
      user,
      token,
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET /api/auth/verifyAdminAuth
 * Renew token
 */
const verifyAdminAuth = async (req, res) => {
  const { id, roleId } = req.user;

  if (!id || !roleId) {
    return res.status(400).json({
      status: 'error',
      message: 'Id or role is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Id must be a number',
    });
  }

  try {
    const user = await db.User.findOne({
      include: db.User.associations.Role,
      where: { id },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Unregistered user',
      });
    }

    const token = await db.User.generateToken(user.id, user.roleId);

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token no found',
      });
    }

    if (user.roleId === 2) {
      return res.status(401).json({
        status: 'error',
        message: 'User is not an admin',
      });
    }

    return res.status(200).json({
      status: 'success',
      user,
      token,
    });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to recover password
 * Send email to recovery user password
 * - Verify if user status
 */
const recoveryPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is required',
    });
  }

  try {
    const user = await db.User.findOne({ include: db.User.associations.Role, where: { email } });
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Unregistered user',
      });
    }

    if (user.status === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'User not confirmed',
      });
    }

    sendEmailRecoveryPassword(user);

    return res.status(200).json({
      status: 'success',
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const restorePasswordEmail = async (req, res) => {
  const { encodeToken } = req.params;
  const { password } = req.body;

  console.log({ encodeToken });

  const { id } = await jwt.verify(encodeToken, process.env.JWT_SECRET);
  console.log({ id });

  try {
    const [user] = await db.User.update(
      { password: db.User.encodePassword(password) },
      { where: { id } }
    );

    console.log({ user });

    if (user === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error to updated user',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 'error', message: 'There was an error loading the user' });
  }
};

/**
 * Controller to confirm email
 * - Verify if user exists
 * - Verify if the token is valid
 */
const confirmationEmail = async (req, res) => {
  const { encodeToken } = req.params;

  console.log({ encodeToken });

  const { id } = await jwt.verify(encodeToken, process.env.JWT_SECRET);
  try {
    const [user] = await db.User.update({ status: 1 }, { where: { id } });

    console.log({ user });

    if (user === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error to updated user',
      });
    }

    res.writeHead(302, {
      Location: 'http://localhost:4200/email',
    });
    return res.end();
  } catch (error) {
    console.log(error);
    res.writeHead(302, {
      Location: 'http://localhost:4200/email/verify-error',
    });
    return res.end();
  }
};

/**
 * Controller to unsubscribe account
 * - Verify if user exists
 * - Verify if the token is valid
 */
const unsubscribeAccount = async (req, res) => {
  const { encodeToken } = req.params;

  console.log({ encodeToken });

  const { id } = await jwt.verify(encodeToken, process.env.JWT_SECRET);
  try {
    const user = await db.User.destroy({ where: { id, status: 1 } });

    if (user === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error not found user',
      });
    }

    res.writeHead(302, {
      Location: 'http://localhost:4200/unsubscribe/completed',
    });
    return res.end();
  } catch (error) {
    console.log({ error: error.message });
    res.writeHead(302, {
      Location: 'http://localhost:4200/unsubscribe/error',
    });
    return res.end();
  }
};

/**
 * Get user by token
 */
const getIdByToken = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: 'error',
      message: 'Token not found',
    });
  }

  try {
    const token = authorization.split(' ')[1];
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);

    return res.json({ status: 'success', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Invalid Token',
    });
  }
};

/**
 * POST /api/auth/verifyEncodeToken/:encodeToken
 * Verify encodeToken
 */
const verifyEncodeToken = async (req, res) => {
  const { encodeToken } = req.body;

  try {
    const { id, roleId } = await jwt.verify(encodeToken, process.env.JWT_SECRET);
    console.log({ id, roleId });

    // roleId is not genereate to restore password
    if (!id || roleId) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid Token',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Valid Token' });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(400).json({ status: 'success', message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyAuth,
  verifyAdminAuth,
  recoveryPassword,
  confirmationEmail,
  restorePasswordEmail,
  unsubscribeAccount,
  getIdByToken,
  verifyEncodeToken,
};

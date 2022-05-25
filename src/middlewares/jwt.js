const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Validate JWT token
 */
const validateJWT = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: 'error',
      message: 'Token not found',
    });
  }

  try {
    const token = authorization.split(' ')[1];
    const { id, roleId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id, roleId };

    next();
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Token invalid',
    });
  }
};

/**
 * Validate JWT token admin
 */
const validateAdminJWT = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      status: 'error',
      message: 'Token not found',
    });
  }

  try {
    const token = authorization.split(' ')[1];
    const { id, roleId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id, roleId };

    if (roleId !== 1) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not authorized to perform this action',
      });
    }

    next();
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      status: 'error',
      message: 'Token invalid',
    });
  }
};

module.exports = { validateJWT, validateAdminJWT };

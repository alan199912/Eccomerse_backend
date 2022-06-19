const db = require('../models/index');
const bcryptjs = require('bcryptjs');

/**
 * POST api/v1/users/setUser
 * Set new user
 */
const setUser = async (req, res) => {
  const { username, email, password, country, phone, name, lastName, status, roleId } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !country ||
    !phone ||
    !name ||
    !lastName ||
    !status ||
    !roleId
  ) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const user = await db.User.create({
      username,
      email,
      password,
      country,
      phone,
      name,
      lastName,
      status,
      roleId,
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Error creating user',
      });
    }

    return res.status(201).json({ status: 'success', message: 'User created successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET /api/users/getUserList
 * Controller to get user list
 */
const getUserList = async (req, res) => {
  try {
    const users = await db.User.findAll({
      include: db.Roles,
      attributes: { exclude: ['password'] },
    });

    if (!users) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting user',
      });
    }

    return res.status(200).json({ status: 'success', users });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET api/v1/users/getUserById
 * Get user by id
 */
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'User id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'User id must be a number',
    });
  }

  try {
    const user = await db.User.findOne({
      include: db.Roles,
      where: { id },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Error find user',
      });
    }

    return res.status(200).json({ status: 'success', user });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET api/v1/users/getAllDataUserById
 * Get user by id
 */
const getAllDataUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'User id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'User id must be a number',
    });
  }

  try {
    const user = await db.User.findOne({
      include: db.Roles,
      where: { id },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Error find user',
      });
    }

    return res.status(200).json({ status: 'success', user });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * DELETE api/v1/users/deleteUser
 * Delete user by id
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({ status: 'error', message: 'The param was required to be a number' });
  }

  try {
    const user = await db.User.destroy({
      where: { id },
    });

    if (user === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error deleting or user does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'User was delete successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * POST api/v1/users/restoreUser
 * Restore user by id
 */
const restoreUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({ status: 'error', message: 'The param was required to be a number' });
  }

  try {
    const user = await db.User.restore({
      where: { id },
    });

    if (user === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error restoring or user does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'User was restoring successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * PUT api/v1/users/updateUser
 * Update user by id
 */
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, country, phone, name, lastName } = req.body;

  if (!id) {
    return res.status(400).json({
      message: 'Id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({ status: 'error', message: 'The param was required to be a number' });
  }

  if (!username || !email || !country || !phone || !name || !lastName) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const [codeUserUpdated] = await db.User.update(
      { username, email, country, phone, name, lastName },
      { where: { id } }
    );

    if (codeUserUpdated === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error updating or user does not exist',
      });
    }

    const user = await db.User.findOne({
      where: { id },
      include: db.Roles,
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Error find user',
      });
    }
    return res.status(200).json({ status: 'success', message: 'User was updating successfully', user });
  } catch (error) {
    console.log('ERROR', { error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * PUT api/v1/users/updateAllDataUser
 * Update user by id
 */
const updateAllDataUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, country, phone, name, lastName, password, roleId, status } = req.body;

  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'Id is required',
    });
  }

  if (isNaN(id)) {
    console.log('here');
    return res.status(400).json({ status: 'error', message: 'The param was required to be a number' });
  }

  if (
    !username ||
    !email ||
    !country ||
    !phone ||
    !name ||
    !lastName ||
    !password ||
    !roleId ||
    !status
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields are required',
    });
  }

  try {
    const salt = bcryptjs.genSaltSync(10); //  Encrypting password
    console.log(salt);
    const passwordEncrypted = bcryptjs.hashSync(password, salt);
    console.log(passwordEncrypted);
    const [codeUserUpdated] = await db.User.update(
      {
        username,
        email,
        country,
        phone,
        name,
        lastName,
        passwordEncrypted,
        roleId,
        status,
      },
      { where: { id } }
    );

    console.log(codeUserUpdated);

    if (codeUserUpdated === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error updating or user does not exist',
      });
    }

    const user = await db.User.findOne({
      where: { id },
      include: db.Roles,
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Error find user',
      });
    }
    return res.status(200).json({ status: 'success', message: 'User was updating successfully', user });
  } catch (error) {
    console.log('ERROR', { error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * PUT api/v1/users/changePasswordUser
 * Change password user by id
 */
const changePasswordUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const [user] = await db.User.update(
      { password: db.User.encodePassword(password) },
      { where: { id } }
    );

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

module.exports = {
  getUserById,
  setUser,
  getUserList,
  getUserById,
  deleteUser,
  restoreUser,
  updateUser,
  changePasswordUser,
  getAllDataUserById,
  updateAllDataUser,
};

const db = require('../models/index');

/**
 * POST api/v1/roles/setRole
 * set new role
 */
const setRole = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const role = await db.Roles.create({ name });

    if (!role) {
      return res.status(400).json({
        status: 'error',
        message: 'Error creating role',
      });
    }

    return res.status(201).json({ status: 'success', message: 'Role created successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET api/v1/roles/getRolesList
 * Get all roles
 */
const getRolesList = async (req, res) => {
  try {
    const roles = await db.Roles.findAll({
      paranoid: false,
    });

    if (!roles) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting roles',
      });
    }

    return res.status(200).json({ status: 'success', roles });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET api/v1/roles/getRolesListEnabled
 * Get all roles enabled
 */
const getRolesListEnabled = async (req, res) => {
  try {
    const roles = await db.Roles.findAll();

    if (!roles) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting roles',
      });
    }

    return res.status(200).json({ status: 'success', roles });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET api/v1/roles/getRoleById
 * Get role by id
 */
const getRoleById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'Id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'The param was required to be a number',
    });
  }

  try {
    const role = await db.Roles.findOne({ where: { id } });

    if (!role) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting role',
      });
    }

    return res.status(200).json({ status: 'success', role });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * DELETE api/v1/roles/deleteRole
 * Delete role by id
 */
const deleteRole = async (req, res) => {
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
    const role = await db.Roles.destroy({
      where: { id },
    });

    if (role === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error deleting or role does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Role was delete successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * POST api/v1/roles/restoreRole
 * Restore role by id
 */
const restoreRole = async (req, res) => {
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
    const role = await db.Roles.restore({
      where: { id },
    });

    if (role === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error restoring or role does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Role was restoring successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * PUT api/v1/roles/updateRole
 * Update role by id
 */
const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  console.log({ name });

  if (!id) {
    return res.status(400).json({
      message: 'Id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({ status: 'error', message: 'The param was required to be a number' });
  }

  if (!name) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const [role] = await db.Roles.update({ name }, { where: { id } });

    console.log(role);

    if (role === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error updating or role does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Role was updating successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  setRole,
  getRolesList,
  getRoleById,
  deleteRole,
  restoreRole,
  updateRole,
  getRolesListEnabled,
};

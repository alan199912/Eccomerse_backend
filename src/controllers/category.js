const db = require('../models/index');

/**
 * POST api/v1/categories/setCategory
 * set new category
 */
const setCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const category = await db.Category.create({ name });

    if (!category) {
      return res.status(400).json({
        status: 'error',
        message: 'Error creating category',
      });
    }

    return res.status(201).json({ status: 'success', message: 'Category created successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET api/v1/categories/getCategoriesList
 * Get catgories list
 */
const getCategoriesList = async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      attributes: ['id', 'name', 'createdAt', 'updatedAt', 'deletedAt'],
    });

    if (!categories) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting category',
      });
    }

    return res.status(200).json({ status: 'success', categories });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET api/v1/categories/getCategoriesListIncludeDeleted
 * Get catgories list include deleted
 */
const getCategoriesListIncludeDeleted = async (req, res) => {
  try {
    const categories = await db.Category.findAll({
      attributes: ['id', 'name', 'createdAt', 'updatedAt', 'deletedAt'],
      paranoid: false,
    });

    if (!categories) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting category',
      });
    }

    return res.status(200).json({ status: 'success', categories });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET api/v1/categories/getCategoryById
 * Get category by id
 */
const getCategoryById = async (req, res) => {
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
  console.log({ id });

  try {
    const category = await db.Category.findOne({ where: { id } });

    console.log({ category });

    if (!category) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting category',
      });
    }

    return res.status(200).json({ status: 'success', category });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * DELETE api/v1/categories/deleteCategory
 * Delete category by id
 */
const deleteCategory = async (req, res) => {
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
    const category = await db.Category.destroy({
      where: { id },
    });

    if (category === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error deleting or category does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Category was delete successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * POST api/v1/categories/restoreCategory
 * Restore category by id
 */
const restoreCategory = async (req, res) => {
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
    const category = await db.Category.restore({
      where: { id },
    });
    console.log({ category });

    if (category === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error restoring or category does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Category was restoring successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * PUT api/v1/categories/updateCategory
 * Update category by id
 */
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

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
    const [category] = await db.Category.update({ name }, { where: { id } });

    console.log(category);

    if (category === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error updating or category does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Category was updating successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  setCategory,
  getCategoriesList,
  getCategoryById,
  deleteCategory,
  restoreCategory,
  updateCategory,
  getCategoriesListIncludeDeleted,
};

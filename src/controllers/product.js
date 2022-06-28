const db = require('../models/index');

/**
 * POST api/products/setProduct
 * Controller to setting a product
 */
const setProduct = async (req, res) => {
  const {
    name,
    description,
    richDescription,
    brand,
    price,
    categoryId,
    rating,
    isFeatured,
    mainProductImageId,
    restProductImageId,
  } = req.body;

  console.log({
    name,
    description,
    richDescription,
    brand,
    price,
    categoryId,
    rating,
    isFeatured,
    mainProductImageId,
    restProductImageId,
  });

  //TODO: IMPLEMENT EXPRESS VALIDATION
  if (
    (!name ||
      !description ||
      !richDescription ||
      !brand ||
      !price ||
      !categoryId ||
      !rating ||
      isFeatured === null ||
      isFeatured === undefined,
    !mainProductImageId,
    !restProductImageId)
  ) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    const category = await db.Category.findOne({ where: { id: categoryId } });

    if (!category) {
      return res.status(400).json({
        message: 'Category not found',
      });
    }

    const product = await db.Products.create({
      name,
      description,
      richDescription,
      brand,
      price,
      categoryId,
      rating,
      isFeatured,
      mainProductImageId,
      restProductImageId,
    });

    if (!product) {
      return res.status(400).json({
        status: 'error',
        message: 'Error creating product',
      });
    }

    return res.status(201).json({ status: 'success', message: 'Product created successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * GET api/products/getProductsList
 * Controller to get products list
 */
const getProductsList = async (req, res) => {
  try {
    const products = await db.Products.findAll({
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
    });

    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the products',
      });
    }

    return res.status(200).json({ status: 'success', products });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to get products by id
 */
const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Id is required',
    });
  }

  const filterId = id.split(',').map((productId) => +productId);

  try {
    if (filterId.length > 1) {
      const products = await db.Products.findAll({
        where: { id: filterId },
        include: [
          { model: db.Category },
          { model: db.MainProductImage },
          { model: db.RestProductImage },
        ],
      });

      if (!products) {
        return res.status(400).json({
          status: 'error',
          message: 'Error found the products',
        });
      }

      return res.status(200).json({ status: 'success', products });
    }

    const product = await db.Products.findOne({
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
      where: { id },
    });

    if (!product) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the product',
      });
    }

    console.log({ product: product });

    return res.status(200).json({ status: 'success', product });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to update products by id
 */
const updateProduct = async (req, res) => {
  const {
    name,
    description,
    richDescription,
    brand,
    price,
    categoryId,
    rating,
    isFeatured,
    mainProductImageId,
    restProductImageId,
  } = req.body;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'Id is required',
    });
  }

  try {
    if (categoryId) {
      const category = await db.Category.findOne({ where: { id: categoryId } });

      if (!category) {
        return res.status(400).json({
          status: 'error',
          message: 'Category not found',
        });
      }
    }

    const productExist = await db.Products.findOne({
      where: { id },
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
    });

    if (!productExist) {
      return res.status(400).json({
        status: 'error',
        message: 'Category not found',
      });
    }

    const [product] = await db.Products.update(
      {
        name: name || productExist.name,
        description: description || productExist.description,
        richDescription: richDescription || productExist.richDescription,
        brand: brand || productExist.brand,
        price: price || productExist.price,
        categoryId: categoryId || productExist.categoryId,
        rating: rating || productExist.rating,
        isFeatured: isFeatured || productExist.isFeatured,
        mainProductImageId: mainProductImageId || productExist.mainProductImageId,
        restProductImageId: restProductImageId || productExist.restProductImageId,
      },
      { where: { id } }
    );

    if (product === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error updating products',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Update product successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to delete a Product
 */
const deleteProduct = async (req, res) => {
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
    const product = await db.Products.destroy({ where: { id } });

    if (product === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error deleting or product does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Product was delete successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to restore a product
 */
const restoreProduct = async (req, res) => {
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
    const product = await db.Products.restore({
      where: { id },
    });
    console.log({ product });

    if (product === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error restoring or product does not exist',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Product was restoring successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getCountProducts = async (req, res) => {
  try {
    const count = await db.Products.count();
    return res.status(200).json({ status: 'success', totalCountProducts: count });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  const limitProducts = req.params.limit || 0;

  try {
    const products = await db.Products.findAll({
      where: { isFeatured: true },
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
      limit: +limitProducts,
    });

    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the products',
      });
    }

    return res.status(200).json({ status: 'success', products });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getProductByCategoryId = async (req, res) => {
  const { categories } = req.query;

  if (!categories) {
    return res.status(400).json({
      status: 'error',
      message: 'Category id is required',
    });
  }

  const filterCategory = categories.split(',').map((category) => +category);

  console.log(filterCategory);

  try {
    const products = await db.Products.findAll({
      where: { categoryId: filterCategory },
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
    });

    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the products',
      });
    }

    return res.status(200).json({ status: 'success', products });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getFeaturedProductByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  const limitProducts = req.params.limit || 0;

  if (!categoryId) {
    return res.status(400).json({
      status: 'error',
      message: 'Category id is required',
    });
  }

  const filterCategory = categoryId.split(',').map((category) => +category);

  console.log(filterCategory);

  try {
    const products = await db.Products.findAll({
      where: { categoryId: filterCategory, isFeatured: true },
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
      limit: +limitProducts,
    });

    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the products',
      });
    }

    return res.status(200).json({ status: 'success', products });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getLatestProductInEachCategoryByLimit = async (req, res) => {
  const limitProducts = req.params.limit || 0;

  try {
    const products = await db.Products.findAll({
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
      limit: +limitProducts,
      order: [
        ['createdAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the products',
      });
    }

    console.log({ products });

    return res.status(200).json({ status: 'success', products });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getProductsListSortBy = async (req, res) => {
  let { page, limit } = req.query;
  const { sortBy } = req.params;

  limit = limit ? +limit : 3;
  page = page ? page * limit : 0;

  try {
    if (sortBy === 'featured') {
      const products = await db.Products.findAndCountAll({
        include: [
          { model: db.Category },
          { model: db.MainProductImage },
          { model: db.RestProductImage },
        ],
        where: { isFeatured: sortBy === 'featured' },
        offset: +page,
        limit: +limit,
      });

      if (!products) {
        return res.status(400).json({
          status: 'error',
          message: 'Error found the products',
        });
      }

      return res
        .status(200)
        .json({ status: 'success', products: products.rows, totalCountProducts: products.count });
    }

    const products = await db.Products.findAndCountAll({
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
      order: [['price', sortBy]],
      offset: +page,
      limit: +limit,
    });

    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the products',
      });
    }

    return res
      .status(200)
      .json({ status: 'success', products: products.rows, totalCountProducts: products.count });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getProductsListPagination = async (req, res) => {
  let { page, limit } = req.query;

  limit = limit ? +limit : 3;
  page = page ? page * limit : 0;

  try {
    const products = await db.Products.findAndCountAll({
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
      offset: +page,
      limit: +limit,
    });

    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the products',
      });
    }

    return res
      .status(200)
      .json({ status: 'success', products: products.rows, totalCountProducts: products.count });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getProductsByName = async (req, res) => {
  const { name } = req.query;

  try {
    const Op = db.Sequelize.Op;

    const products = await db.Products.findAndCountAll({
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
      where: { name: { [Op.like]: `%${name}%` } },
    });

    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the products',
      });
    }

    console.log({ products });

    return res
      .status(200)
      .json({ status: 'success', products: products.rows, totalCountProducts: products.count });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getProductsListByCategoryIdPagination = async (req, res) => {
  let { page, limit } = req.query;
  const { id } = req.params;

  limit = limit ? +limit : 3;
  page = page ? page * limit : 0;

  try {
    const products = await db.Products.findAndCountAll({
      where: { categoryId: id },
      include: [{ model: db.Category }, { model: db.MainProductImage }, { model: db.RestProductImage }],
      offset: +page,
      limit: +limit,
    });

    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'Error found the products',
      });
    }

    return res
      .status(200)
      .json({ status: 'success', products: products.rows, totalCountProducts: products.count });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  setProduct,
  getProductsList,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getCountProducts,
  getFeaturedProducts,
  getProductByCategoryId,
  getFeaturedProductByCategoryId,
  getLatestProductInEachCategoryByLimit,
  getProductsListSortBy,
  getProductsListPagination,
  getProductsByName,
  getProductsListByCategoryIdPagination,
};

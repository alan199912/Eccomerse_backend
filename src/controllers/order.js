const { createOrderItem } = require('../helpers/order');
const { createPayment } = require('../helpers/paypal');
const db = require('../models/index');
const sequelize = db.sequelize;

/**
 * Create an order
 */
const setOrder = async (req, res) => {
  const { orderItems, userId } = req.body;

  if (orderItems.length === 0 || !userId) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  try {
    // Verify if user exists
    const user = await db.User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    let totalPrice = 0;

    const response = await createOrderItem(orderItems, totalPrice);

    if (response.status === 'error') {
      return res.status(400).json({
        status: 'error',
        message: response.message,
      });
    }

    const items = response.map((el) => el.items);
    const total = response.map((el) => el.total);

    // Create order
    const order = await db.Orders.create({
      status: 'PENDING',
      totalPrice: total[total.length - 1],
      userId,
      transactionId: '',
      payerId: '',
      payerEmail: '',
      orderPaypal: '',
    });

    if (!order) {
      return res.status(400).json({
        status: 'error',
        message: 'Error creating an order',
      });
    }

    // Add order items to order
    order.addOrderItem(items);

    const link = await createPayment(
      orderItems,
      total[total.length - 1],
      order.id,
      user.id,
      user.roleId
    );

    console.log({ link });

    if (link?.status === 'error') {
      return res.status(400).json({
        status: 'error',
        message: link.message,
      });
    }

    return res.status(201).json({ status: 'success', link });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to get order list
 */
const getOrdersList = async (req, res) => {
  try {
    const orders = await db.Orders.findAll({
      include: [
        { model: db.User, attributes: { exclude: ['password'] }, include: { model: db.Roles } },
        {
          model: db.OrderItems,
          attributes: ['productId', 'quantity'],
          include: { model: db.Products, include: { model: db.Category } },
        },
      ],
    });

    if (!orders) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting order list',
      });
    }

    return res.status(200).json({ status: 'success', orders });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to get order by id
 */
const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Order id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'Order id must be an integer',
    });
  }

  try {
    const order = await db.Orders.findOne({
      where: { id },
      include: [
        { model: db.User, attributes: { exclude: ['password'] }, include: { model: db.Roles } },
        {
          model: db.OrderItems,
          attributes: ['productId', 'quantity'],
          include: { model: db.Products, include: { model: db.Category } },
        },
      ],
    });

    if (!order) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting order',
      });
    }

    return res.status(200).json({ status: 'success', order });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to update order by id
 */
const updateOrder = async (req, res) => {
  const { status, transactionId, payerId, payerEmail, orderPaypal } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({
      message: 'status is required',
    });
  }

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
    const order = await db.Orders.findOne({ where: { id } });

    if (!order) {
      return res.status(400).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    const [orderUpdated] = await db.Orders.update(
      { status, transactionId, payerId, payerEmail, orderPaypal },
      { where: { id } }
    );

    if (orderUpdated === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error updating order',
      });
    }

    return res.status(200).json({ status: 'success', message: 'Update order successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to delete a order by id
 */
const deleteOrder = async (req, res) => {
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
    const order = await db.Orders.destroy({
      where: { id },
    });

    if (order === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error deleting or order does not exist',
      });
    }

    const orderItems = await db.Order_orderItems.findAll({
      where: { orderId: id },
    });

    orderItems.forEach(async (item) => {
      await db.OrderItems.destroy({
        where: { id: item.orderItemId },
      });
    });

    await db.Order_orderItems.destroy({
      where: { orderId: id },
    });

    return res.status(200).json({ status: 'success', message: 'Order was delete successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to restore a order
 */
const restoreOrder = async (req, res) => {
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
    const order = await db.Orders.restore({
      where: { id },
    });

    if (order === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error restoring or order does not exist',
      });
    }

    const orderItems = await db.Order_orderItems.findAll({
      where: { orderId: id },
      paranoid: false,
    });

    orderItems.forEach(async (item) => {
      await db.OrderItems.restore({
        where: { id: item.orderItemId },
      });
    });

    await db.Order_orderItems.restore({
      where: { orderId: id },
    });

    return res.status(200).json({ status: 'success', message: 'Order was restoring successfully' });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Controller to get a total sale of orders and its items count
 */
const getTotalSales = async (req, res) => {
  try {
    const totalSale = await db.Orders.findAndCountAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('totalPrice')), 'sumTotalPrice']],
    });

    if (!totalSale) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting total sales',
      });
    }

    return res.status(200).json({
      status: 'success',
      totalSale: { total: totalSale.rows[0].toJSON().sumTotalPrice, count: totalSale.count },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'Order id is required',
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'Order id must be an integer',
    });
  }

  try {
    const orders = await db.Orders.findAll({
      where: { userId: id, status: 'COMPLETED' },
      include: [
        { model: db.User, attributes: { exclude: ['password'] }, include: { model: db.Roles } },
        {
          model: db.OrderItems,
          attributes: ['productId', 'quantity'],
          include: {
            model: db.Products,
            include: { model: db.Category },
            include: { model: db.MainProductImage },
          },
        },
      ],
      attributes: { exclude: ['orderPaypal', 'payerEmail', 'payerId', 'transactionId'] },
    });

    if (!orders) {
      return res.status(400).json({
        status: 'error',
        message: 'Error getting order or does not exist',
      });
    }

    return res.status(200).json({ status: 'success', orders });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  setOrder,
  getOrdersList,
  getOrderById,
  updateOrder,
  deleteOrder,
  restoreOrder,
  getTotalSales,
  getOrdersByUserId,
};

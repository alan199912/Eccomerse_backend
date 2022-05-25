const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const pkg = require('../package.json');

// * ROUTES
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const contactUsRouter = require('./routes/contactUs');
const paymentRouter = require('./routes/payment');
const rolesRouter = require('./routes/roles');
const mainProductsImageRouter = require('./routes/mainProductsImage');
const restProductsImageRouter = require('./routes/restProductsImage');

// * MIDDLEWARES
const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(
  cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
  })
);

// * END POINTS
app.set('pkg', pkg);
app.get('/', (req, res) => {
  res.json({
    name: app.get('pkg').name,
    author: app.get('pkg').author,
    description: app.get('pkg').description,
    version: app.get('pkg').version,
  });
});
app.use(`${process.env.API_URL}/auth`, authRouter);
app.use(`${process.env.API_URL}/products`, productsRouter);
app.use(`${process.env.API_URL}/categories`, categoriesRouter);
app.use(`${process.env.API_URL}/users`, usersRouter);
app.use(`${process.env.API_URL}/orders`, ordersRouter);
app.use(`${process.env.API_URL}/contactUs`, contactUsRouter);
app.use(`${process.env.API_URL}/payment`, paymentRouter);
app.use(`${process.env.API_URL}/roles`, rolesRouter);
app.use(`${process.env.API_URL}/mainProductsImage`, mainProductsImageRouter);
app.use(`${process.env.API_URL}/restProductsImage`, restProductsImageRouter);
app.use('/images/public', express.static(`${__dirname}/public/uploads`));

module.exports = app;

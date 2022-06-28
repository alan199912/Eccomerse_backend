const db = require('../models/index');

/**
 * POST api/mainImageProducts/setMainImageProduct
 * Controller to setting a image about product
 */
const setMainImageProduct = async (req, res) => {
  console.log({ files: req.file });

  try {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/images/public`;

    const mainImage = await db.MainProductImage.create({
      file: `${basePath}/${fileName}`,
    });

    if (!mainImage) {
      return res.status(400).json({
        status: 'error',
        message: 'Error creating mainImage',
      });
    }

    return res.status(201).json({ status: 'success', mainImage });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * PUT api/mainImageProducts/updateMainImageProduct
 * Controller to update a image about product
 */
const updateMainImageProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/images/public`;

    const mainImage = await db.MainProductImage.findOne({
      where: { id },
    });

    if (!mainImage) {
      return res.status(400).json({
        status: 'error',
        message: 'Main image not found',
      });
    }

    const [mainImageUpdated] = await db.MainProductImage.update(
      {
        file: `${basePath}/${fileName}`,
      },
      { where: { id } }
    );

    if (mainImageUpdated === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error updating main image',
      });
    }

    return res.status(201).json({ status: 'success', mainImage });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  setMainImageProduct,
  updateMainImageProduct,
};

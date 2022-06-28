const db = require('../models/index');

/**
 * POST api/restImageProducts/setRestImageProduct
 * Controller to setting a image about product
 */
const setRestImageProduct = async (req, res) => {
  console.log({ files: req.files });

  try {
    const fileImages = req.files;
    const basePath = `${req.protocol}://${req.get('host')}/images/public`;

    const restImage = await db.RestProductImage.create({
      files: fileImages.map((f) => `${basePath}/${f.filename}`).toString(),
    });

    if (!restImage) {
      return res.status(400).json({
        status: 'error',
        message: 'Error creating restImage',
      });
    }

    return res.status(201).json({ status: 'success', restImage });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * PUT api/restImagesProduct/updateRestImagesProduct
 * Controller to setting a image about product
 */
const updateRestImagesProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const fileImages = req.files;
    const basePath = `${req.protocol}://${req.get('host')}/images/public`;

    const restImage = await db.RestProductImage.findOne({
      where: { id },
    });

    if (!restImage) {
      return res.status(400).json({
        status: 'error',
        message: 'Main image not found',
      });
    }

    const [restImageUpdated] = await db.RestProductImage.update(
      {
        files: fileImages.map((f) => `${basePath}/${f.filename}`).toString(),
      },
      { where: { id } }
    );

    if (restImageUpdated === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Error updating main image',
      });
    }

    return res.status(201).json({ status: 'success', restImage });
  } catch (error) {
    console.log({ error });
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  setRestImageProduct,
  updateRestImagesProduct,
};

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

module.exports = {
  setRestImageProduct,
};

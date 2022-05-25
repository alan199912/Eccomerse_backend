const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid mime type');

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, './src/public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const extension = FILE_TYPE_MAP[file.mimetype];

    cb(null, `${fileName}.${extension}`);
  },
});

const uploadOptions = multer({ storage });

module.exports = uploadOptions;

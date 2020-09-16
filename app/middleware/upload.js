const multer = require('multer');

const multerConf = {
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, '../assets');
    },
    filename: (req, file, next) => {
      next(
        null,
        file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]
      );
    }
  }),
  fileFilter: (req, file, next) => {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if (image) {
      next(null, true);
    } else {
      next({ message: 'File type not supported' }, false);
    }
  }
};

const upload = multer(multerConf).single('photo');

module.exports = upload;
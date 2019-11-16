const multer = require('multer');
const HttpError = require('http-errors');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${file.fieldname}_${new Date().toISOString()}`),
});

const upload = multer({ storage }).single('image');

exports.storeFile = (req, res, next) => {
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      const multerError = new HttpError[400](`Multer error. ${err.message}`);
      next(multerError);
    } else if (err) {
      // An unknown error occurred when uploading.
      const uploadingError = new HttpError[400](`An unknown uploading error. ${err.message}`);
      next(uploadingError);
    }
    next();
  });
};

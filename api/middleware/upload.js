const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    return cb(null, true);
  }
  return cb(new Error('goes wrong on the mimetype'));
};

module.exports = multer({
  storage,
  limits:
  {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

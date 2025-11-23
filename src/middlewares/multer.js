const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'git_repo',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: Date.now() + '-' + file.originalname.split('.')[0],
  }),
});

const uploads = multer({ storage });
module.exports = uploads;

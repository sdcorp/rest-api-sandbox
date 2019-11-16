const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { promisify } = require('util');

const unlinkPromisified = promisify(fs.unlink);

const cloudUpload = async filePath => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath);

    await unlinkPromisified(filePath); // delete local file after uploading

    return uploadResponse.url;
  } catch (e) {
    console.log('Upload to Cloudinary failed!', { message: e.message });
    throw e;
  }
};

module.exports = cloudUpload;

const cloudinary = require('cloudinary').v2;
const streamifier = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer directly to Cloudinary via upload_stream
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {Object} options - Cloudinary upload options (folder, resource_type, public_id, etc.)
 * @returns {Promise<Object>} Cloudinary upload result containing secure_url
 */
const uploadStreamToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary credentials exist
    const isConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

    if (!isConfigured) {
      console.warn(
        '⚠️ Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not fully configured in .env. Using mock cloud URL.'
      );
      const mockPublicId = 'mock-' + Date.now();
      const mockUrl =
        options.resource_type === 'image'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : `https://res.cloudinary.com/demo/raw/upload/v1/job_board/resumes/${mockPublicId}.pdf`;

      return resolve({
        secure_url: mockUrl,
        public_id: mockPublicId,
        format: options.resource_type === 'image' ? 'jpg' : 'pdf',
      });
    }

    const uploadOptions = {
      folder: options.folder || 'job_board',
      resource_type: options.resource_type || 'auto',
      ...options,
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    const bufferStream = new streamifier.PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(stream);
  });
};

module.exports = {
  cloudinary,
  uploadStreamToCloudinary,
};

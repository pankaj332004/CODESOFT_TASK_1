const multer = require('multer');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');

/**
 * Custom Cloudinary Storage Engine for Multer
 * Pipes files directly from incoming multipart requests into Cloudinary without writing to local disk.
 */
class CloudinaryMulterStorage {
  constructor(options = {}) {
    this.folder = options.folder || 'job_board';
    this.resource_type = options.resource_type || 'auto';
  }

  _handleFile(req, file, cb) {
    const isConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

    // Fallback if Cloudinary API keys are not yet configured in .env
    if (!isConfigured) {
      console.warn(
        `⚠️ [Multer + Cloudinary] Cloudinary credentials not configured in .env. Providing mock Cloudinary URL for testing.`
      );
      const mockPublicId = 'cloud-' + Date.now();
      const mockUrl =
        this.resource_type === 'image'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : `https://res.cloudinary.com/demo/raw/upload/v1/job_board/resumes/${mockPublicId}.pdf`;

      // Drain the file stream
      file.stream.on('data', () => {});
      file.stream.on('end', () => {
        cb(null, {
          path: mockUrl,
          secure_url: mockUrl,
          filename: mockPublicId,
          public_id: mockPublicId,
        });
      });
      file.stream.on('error', (err) => cb(err));
      return;
    }

    const ext = path.extname(file.originalname).replace('.', '') || 'pdf';
    const cleanBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const publicId = `${cleanBase}_${Date.now()}`;

    const uploadOptions = {
      folder: this.folder,
      resource_type: this.resource_type,
      public_id: this.resource_type === 'raw' ? `${publicId}.${ext}` : publicId,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.warn('⚠️ Cloudinary upload returned error:', error.message);
          console.warn('⚠️ (Hint: Ensure your Cloudinary API key has "create/upload" permissions in Cloudinary Settings).');
          const fallbackUrl =
            this.resource_type === 'image'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              : `https://res.cloudinary.com/demo/raw/upload/v1/job_board/resumes/${publicId}.${ext}`;
          return cb(null, {
            path: fallbackUrl,
            secure_url: fallbackUrl,
            filename: publicId,
            public_id: publicId,
          });
        }

        cb(null, {
          path: result.secure_url,
          secure_url: result.secure_url,
          filename: result.public_id,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(req, file, cb) {
    if (file.public_id) {
      cloudinary.uploader.destroy(
        file.public_id,
        { resource_type: this.resource_type },
        cb
      );
    } else {
      cb(null);
    }
  }
}

// 1. Resume Storage via Multer + Cloudinary (PDF, DOC, DOCX)
const resumeStorage = new CloudinaryMulterStorage({
  folder: 'job_board/resumes',
  resource_type: 'raw',
});

const resumeFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: resumeFilter,
});

// 2. Avatar Storage via Multer + Cloudinary (Images)
const avatarStorage = new CloudinaryMulterStorage({
  folder: 'job_board/avatars',
  resource_type: 'image',
});

const avatarFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, WEBP, and GIF images are allowed'), false);
  }
};

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: avatarFilter,
});

module.exports = {
  uploadResume,
  uploadAvatar,
  CloudinaryMulterStorage,
};

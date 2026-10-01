const nodemailer = require('nodemailer');

let transporter;
let isEthereal = false;

const getTransporter = async () => {
  if (transporter) return transporter;

  // If real credentials are provided
  if (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_HOST !== 'smtp.ethereal.email' &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_USER !== 'ethereal_user'
  ) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return transporter;
  }

  // Create real Ethereal test inbox on the fly for interactive web preview
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    isEthereal = true;
    console.log('📬 Initialized Ethereal Email test sandbox for real-time web previews');
  } catch (err) {
    // Fallback mock
    transporter = {
      sendMail: async (mailOptions) => ({ messageId: 'mock-' + Date.now() }),
    };
  }

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailer = await getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Job Board" <no-reply@jobboard.com>',
      to,
      subject,
      text: text || (html ? html.replace(/<[^>]*>?/gm, '') : ''),
      html,
    };

    const info = await mailer.sendMail(mailOptions);

    console.log('---------------------------------------------------------');
    console.log(`📧 [EMAIL DELIVERED TO]: ${to}`);
    console.log(`📌 [SUBJECT]: ${subject}`);

    if (isEthereal && nodemailer.getTestMessageUrl(info)) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`🔗 [OPEN IN BROWSER TO VIEW EMAIL]: ${previewUrl}`);
      console.log('---------------------------------------------------------');
      return { ...info, previewUrl };
    }

    console.log('---------------------------------------------------------');
    return info;
  } catch (error) {
    console.error('Email sending error (handled gracefully):', error.message);
    return null;
  }
};

module.exports = { sendEmail };

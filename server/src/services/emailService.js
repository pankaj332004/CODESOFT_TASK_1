const nodemailer = require('nodemailer');

let transporter;

const getTransporter = async () => {
  if (transporter) return transporter;

  // Use configured SMTP or create test account
  if (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_HOST !== 'smtp.ethereal.email' &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_USER !== 'ethereal_user'
  ) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Development / fallback preview mode
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('-----------------------------------------');
        console.log('📧 [EMAIL NOTIFICATION SENT]');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Body:\n${mailOptions.text || mailOptions.html}`);
        console.log('-----------------------------------------');
        return { messageId: 'mock-email-' + Date.now() };
      },
    };
  }

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailer = await getTransporter();
    const info = await mailer.sendMail({
      from: process.env.EMAIL_FROM || '"Job Board" <no-reply@jobboard.com>',
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html,
    });
    return info;
  } catch (error) {
    console.error('Email sending error (handled gracefully):', error.message);
    return null;
  }
};

module.exports = { sendEmail };

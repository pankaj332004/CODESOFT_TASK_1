const { sendEmail } = require('./emailService');

const sendApplicationNotification = async ({
  candidateEmail,
  candidateName,
  employerEmail,
  employerName,
  jobTitle,
  companyName,
}) => {
  // 1. Send confirmation to candidate
  await sendEmail({
    to: candidateEmail,
    subject: `Application Submitted: ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17324f;">
        <h2 style="color: #1288e8;">Job Application Received!</h2>
        <p>Dear ${candidateName},</p>
        <p>Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
        <p>Your application and resume have been successfully submitted to the employer. You can track the status of your application from your candidate dashboard.</p>
        <p style="margin-top: 24px;">Best regards,<br/>The Job Board Team</p>
      </div>
    `,
  });

  // 2. Send alert to employer
  if (employerEmail) {
    await sendEmail({
      to: employerEmail,
      subject: `New Application for ${jobTitle} from ${candidateName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17324f;">
          <h2 style="color: #1288e8;">New Candidate Application</h2>
          <p>Hello ${employerName || 'Employer'},</p>
          <p><strong>${candidateName}</strong> (${candidateEmail}) has just applied for your listing: <strong>${jobTitle}</strong>.</p>
          <p>Log in to your Employer Dashboard to review their resume and update the application status.</p>
          <p style="margin-top: 24px;">Best regards,<br/>The Job Board Team</p>
        </div>
      `,
    });
  }
};

const sendStatusUpdateNotification = async ({
  candidateEmail,
  candidateName,
  jobTitle,
  companyName,
  status,
}) => {
  await sendEmail({
    to: candidateEmail,
    subject: `Application Status Updated: ${jobTitle} (${status})`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17324f;">
        <h2 style="color: #1288e8;">Application Status Update</h2>
        <p>Dear ${candidateName},</p>
        <p>The status of your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated to:</p>
        <div style="display: inline-block; padding: 8px 16px; border-radius: 6px; background-color: #e6edf4; font-weight: bold; color: #1288e8;">
          ${status}
        </div>
        <p style="margin-top: 16px;">Check your dashboard for any further communication or interview scheduling.</p>
        <p style="margin-top: 24px;">Best regards,<br/>The Job Board Team</p>
      </div>
    `,
  });
};

module.exports = {
  sendApplicationNotification,
  sendStatusUpdateNotification,
};

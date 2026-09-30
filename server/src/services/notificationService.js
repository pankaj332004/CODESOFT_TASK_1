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

const sendInterviewScheduledNotification = async ({
  candidateEmail,
  candidateName,
  jobTitle,
  companyName,
  date,
  time,
  type,
  meetingLink,
  notes,
}) => {
  await sendEmail({
    to: candidateEmail,
    subject: `Interview Scheduled: ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #17324f;">
        <h2 style="color: #10b981;">🎉 Interview Scheduled!</h2>
        <p>Dear ${candidateName},</p>
        <p>Great news! <strong>${companyName}</strong> has scheduled an interview with you for the <strong>${jobTitle}</strong> position.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>📅 Date:</strong> ${date}</p>
          <p style="margin: 4px 0;"><strong>⏰ Time:</strong> ${time}</p>
          <p style="margin: 4px 0;"><strong>💻 Type:</strong> ${type || 'Video Call'}</p>
          ${meetingLink ? `<p style="margin: 8px 0;"><a href="${meetingLink}" style="background-color: #10b981; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; display: inline-block;">Join Interview Link</a></p>` : ''}
          ${notes ? `<p style="margin: 8px 0; font-size: 13px; color: #4b5563;"><strong>Notes:</strong> ${notes}</p>` : ''}
        </div>

        <p>You can also view this interview under <strong>My Interviews</strong> on your Candidate Dashboard.</p>
        <p style="margin-top: 24px;">Best regards,<br/>The Job Board Team</p>
      </div>
    `,
  });
};

module.exports = {
  sendApplicationNotification,
  sendStatusUpdateNotification,
  sendInterviewScheduledNotification,
};

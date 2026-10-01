const { sendEmail } = require('./emailService');

const sendApplicationNotification = async ({
  candidateEmail,
  candidateName,
  employerEmail,
  employerName,
  jobTitle,
  companyName,
}) => {
  const companyUrl = `http://localhost:5173/companies/${encodeURIComponent(companyName || 'Tech Company')}`;

  // 1. Send confirmation to candidate with company details
  await sendEmail({
    to: candidateEmail,
    subject: `Application Submitted: ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #0e2947 0%, #1288e8 100%); padding: 28px 24px; text-align: left; color: #ffffff;">
          <span style="background: rgba(255, 255, 255, 0.2); color: #e0f2fe; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px;">
            Application Confirmation
          </span>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
            Application Received!
          </h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #bae6fd;">
            Your profile has been delivered to <strong>${companyName}</strong>.
          </p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 14px; color: #334155; margin-top: 0;">
            Dear <strong>${candidateName}</strong>,
          </p>
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 20px;">
            Thank you for applying! Your application and resume for <strong>${jobTitle}</strong> have been received by the hiring team.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #1288e8; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">
              Hiring Organization
            </span>
            <h2 style="margin: 0; font-size: 18px; font-weight: 800; color: #0f172a;">
              🏢 ${companyName}
            </h2>
            <p style="margin: 4px 0 12px 0; font-size: 12px; color: #64748b;">
              Role: <strong>${jobTitle}</strong> • Status: <strong style="color: #0284c7;">Applied</strong>
            </p>
            <a href="${companyUrl}" target="_blank" style="font-size: 12px; color: #1288e8; text-decoration: none; font-weight: 600;">
              View ${companyName} Profile & Company Insights &rarr;
            </a>
          </div>

          <div style="text-align: center; margin: 24px 0 16px 0;">
            <a href="http://localhost:5173/candidate/applications" style="background-color: #1288e8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; display: inline-block;">
              Track Application Status &rarr;
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0 14px 0;" />
          <p style="margin: 0; font-size: 11px; color: #94a3b8; text-align: center;">
            Job Board Platform • Connecting Talent with Top Technology Organizations
          </p>
        </div>
      </div>
    `,
  });

  // 2. Send alert to employer
  if (employerEmail) {
    await sendEmail({
      to: employerEmail,
      subject: `New Candidate Application: ${jobTitle} from ${candidateName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; color: #1e293b;">
          <div style="background: linear-gradient(135deg, #0e2947 0%, #1288e8 100%); padding: 28px 24px; text-align: left; color: #ffffff;">
            <span style="background: rgba(255, 255, 255, 0.2); color: #e0f2fe; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px;">
              Recruiter Pipeline Alert
            </span>
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
              New Applicant for ${jobTitle}
            </h1>
          </div>

          <div style="padding: 24px;">
            <p style="font-size: 14px; color: #334155; margin-top: 0;">
              Hello <strong>${employerName || companyName || 'Employer'}</strong>,
            </p>
            <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 20px;">
              <strong>${candidateName}</strong> (${candidateEmail}) has just submitted their resume for your listing at <strong>${companyName}</strong>.
            </p>

            <div style="text-align: center; margin: 24px 0 16px 0;">
              <a href="http://localhost:5173/employer" style="background-color: #1288e8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; display: inline-block;">
                Review Candidate in Employer Dashboard &rarr;
              </a>
            </div>
          </div>
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
  const companyUrl = `http://localhost:5173/companies/${encodeURIComponent(companyName || 'Tech Company')}`;

  await sendEmail({
    to: candidateEmail,
    subject: `Application Status Updated: ${jobTitle} at ${companyName} (${status})`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #0e2947 0%, #1288e8 100%); padding: 28px 24px; text-align: left; color: #ffffff;">
          <span style="background: rgba(255, 255, 255, 0.2); color: #e0f2fe; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px;">
            Application Status Update
          </span>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
            Status: ${status}
          </h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #bae6fd;">
            Update from <strong>${companyName}</strong>
          </p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 14px; color: #334155; margin-top: 0;">
            Dear <strong>${candidateName}</strong>,
          </p>
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 20px;">
            The status of your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been updated to:
          </p>

          <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; padding: 10px 24px; border-radius: 30px; background-color: #e0f2fe; font-weight: 800; font-size: 15px; color: #0284c7; border: 1px solid #bae6fd;">
              ${status}
            </div>
          </div>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
              Company
            </span>
            <strong style="font-size: 15px; color: #0f172a;">${companyName}</strong>
            <div style="margin-top: 4px;">
              <a href="${companyUrl}" target="_blank" style="font-size: 12px; color: #1288e8; text-decoration: none;">
                Learn more about ${companyName} &rarr;
              </a>
            </div>
          </div>

          <div style="text-align: center; margin: 24px 0 16px 0;">
            <a href="http://localhost:5173/candidate/applications" style="background-color: #1288e8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; display: inline-block;">
              View in Candidate Dashboard &rarr;
            </a>
          </div>
        </div>
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
  const companyUrl = `http://localhost:5173/companies/${encodeURIComponent(companyName || 'Tech Company')}`;

  await sendEmail({
    to: candidateEmail,
    subject: `🎉 Interview Scheduled: ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #065f46 0%, #059669 100%); padding: 28px 24px; text-align: left; color: #ffffff;">
          <span style="background: rgba(255, 255, 255, 0.2); color: #d1fae5; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px;">
            🎉 Interview Scheduled
          </span>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3;">
            Interview Confirmed with ${companyName}
          </h1>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #a7f3d0;">
            Position: <strong>${jobTitle}</strong>
          </p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 14px; color: #334155; margin-top: 0;">
            Dear <strong>${candidateName}</strong>,
          </p>
          <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! <strong>${companyName}</strong> has reviewed your application and scheduled your upcoming interview round.
          </p>

          <!-- Interview Details Card -->
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #059669; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">
              Confirmed Interview Session
            </span>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; font-size: 13px; color: #374151;">📅 <strong>Date:</strong></td>
                <td style="padding: 5px 0; font-size: 13px; color: #111827; font-weight: 700;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-size: 13px; color: #374151;">⏰ <strong>Time:</strong></td>
                <td style="padding: 5px 0; font-size: 13px; color: #111827; font-weight: 700;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; font-size: 13px; color: #374151;">💻 <strong>Meeting Type:</strong></td>
                <td style="padding: 5px 0; font-size: 13px; color: #111827; font-weight: 700;">${type || 'Video Call'}</td>
              </tr>
            </table>

            ${
              notes
                ? `
              <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #d1fae5; font-size: 12px; color: #166534; font-style: italic;">
                "${notes}"
              </div>
            `
                : ''
            }
          </div>

          <!-- Meeting Link Button -->
          ${
            meetingLink
              ? `
            <div style="text-align: center; margin: 24px 0;">
              <a href="${meetingLink.startsWith('http') ? meetingLink : `https://${meetingLink}`}" target="_blank" style="background-color: #059669; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px; display: inline-block; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.25);">
                🎥 Join Video Meeting &rarr;
              </a>
            </div>
          `
              : ''
          }

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
              About ${companyName}
            </span>
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569;">
              Prepare for your interview by reviewing company culture, active projects, and other team openings.
            </p>
            <a href="${companyUrl}" target="_blank" style="font-size: 12px; color: #1288e8; text-decoration: none; font-weight: 600;">
              View ${companyName} Company Profile &rarr;
            </a>
          </div>

          <div style="text-align: center; margin: 20px 0 10px 0;">
            <a href="http://localhost:5173/candidate/interviews" style="font-size: 12px; color: #64748b; text-decoration: underline;">
              Manage in Candidate Dashboard (My Interviews)
            </a>
          </div>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendApplicationNotification,
  sendStatusUpdateNotification,
  sendInterviewScheduledNotification,
};

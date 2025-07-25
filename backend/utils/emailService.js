const { Resend } = require('resend');
const dotenv = require('dotenv');
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendOTPEmail = async (email, otp) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_SENDER || 'onboarding@resend.dev',
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `
       <div style="margin:0; padding:0; background: #f3f4f6;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height:100vh; padding:30px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow:hidden; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316, #dc2626, #db2777); text-align: center; padding: 40px 30px; position: relative; color: white;">
              <div style="position:relative; z-index:2;">
                <div style="display:inline-block; background: rgba(255,255,255,0.2); padding:15px; border-radius:50%; margin-bottom:20px;">
                  <svg width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h1 style="margin:0; font-size:26px; font-weight:700;">🔐 Password Reset</h1>
                <p style="margin:10px 0 0; font-size:16px; font-weight:300;">InterviewPrep AI Security</p>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <div style="text-align:center; margin-bottom:30px;">
                <h2 style="margin:0 0 15px; font-size:22px; font-weight:600; color:#1f2937;">Your Security Code</h2>
                <p style="margin:0; font-size:16px; color:#6b7280;">Use the verification code below to reset your password securely.</p>
              </div>

              <!-- OTP Box -->
              <div style="background: linear-gradient(145deg, #f8fafc, #e2e8f0); border: 2px dashed #d1d5db; border-radius: 16px; padding: 30px; text-align: center;">
                <p style="margin:0 0 10px; font-size:14px; color:#374151; text-transform:uppercase; letter-spacing:1px;">Verification Code</p>
                <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 18px 30px; border-radius: 12px; display: inline-block; box-shadow: 0 10px 25px rgba(249,115,22,0.3);">
                  <h1 style="margin:0; font-size:40px; letter-spacing:10px; font-family: 'Courier New', monospace; color:#fff;">${otp}</h1>
                </div>
              </div>

              <!-- Security Warning -->
              <div style="margin-top:30px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px;">
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="width:30px;">⚠️</td>
                    <td>
                      <h4 style="margin: 0 0 8px; font-size:16px; color:#92400e;">Important Security Notice</h4>
                      <p style="margin: 0; font-size:14px; color:#78350f;">
                        This code expires in <strong>10 minutes</strong>. If you didn’t request this reset, ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Help -->
              <div style="margin-top:35px; text-align:center; border-top:1px solid #e5e7eb; padding-top:20px;">
                <p style="font-size:14px; color:#6b7280; margin: 0 0 15px;">Need help? Contact our support team:</p>
                <div>
                  <a href="mailto:support@interviewprepai.com" style="color:#f97316; text-decoration:none; font-weight:500;">📧 Email Support</a>
                  <span style="color:#d1d5db;"> • </span>
                  <a href="https://interviewprepai.com/support" style="color:#f97316; text-decoration:none; font-weight:500;">💬 Live Chat</a>
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px; font-size: 13px;">
                This email was sent by <strong>InterviewPrep AI</strong>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                © 2025 InterviewPrep AI. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>`,
      text: `Your OTP is: ${otp}`,
    });

    if (response?.data?.id) {
      console.log('✅ OTP Email sent via Resend:', response.data.id);
      return { success: true, messageId: response.data.id };
    } else {
      console.error('⚠️ Unexpected response from Resend:', response);
      return {
        success: false,
        error: 'Failed to send email',
        details: response
      };
    }
  } catch (error) {
    console.error('❌ Resend email error:', error);
    return {
      success: false,
      error: error.message,
      details: error.toString()
    };
  }
};

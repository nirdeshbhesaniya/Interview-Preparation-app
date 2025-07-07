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
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Use the OTP below to reset your password:</p>
          <h1 style="font-size: 36px; letter-spacing: 6px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
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

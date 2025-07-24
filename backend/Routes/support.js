const express = require('express');
const router = express.Router();
const axios = require('axios');

// Contact support endpoint using Resend API
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, category, message, priority } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled'
            });
        }

        // Check if RESEND_API_KEY is configured
        if (!process.env.RESEND_API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'Server configuration error: RESEND_API_KEY not found. Please configure Resend API key in environment variables.'
            });
        }

        // Use axios to send email via Resend API
        const resendResponse = await axios.post('https://api.resend.com/emails', {
            from: process.env.EMAIL_SENDER || 'onboarding@resend.dev',
            to: [process.env.SUPPORT_TEAM_EMAIL || process.env.EMAIL_USER || 'nirdeshbhesaniya@gmail.com'],
            subject: `[${category.toUpperCase()}] [${priority.toUpperCase()}] ${subject}`,
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
              New Support Request - InterviewPrep AI
            </h2>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #555;">Contact Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Category:</strong> ${category}</p>
              <p><strong>Priority:</strong> ${priority}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #555;">Subject</h3>
              <p style="background: #fff; padding: 15px; border-left: 4px solid #f97316; margin: 0;">
                ${subject}
              </p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #555;">Message</h3>
              <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                This message was sent from the InterviewPrep AI support form on ${new Date().toLocaleString()}.
              </p>
            </div>
          </div>
        `
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        // Send auto-reply to user
        const autoReplyResponse = await axios.post('https://api.resend.com/emails', {
            from: process.env.EMAIL_SENDER || 'onboarding@resend.dev',
            to: [email],
            subject: `We received your support request - ${subject}`,
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f97316, #dc2626, #db2777); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">InterviewPrep AI Support</h1>
            </div>
            
            <div style="background: #fff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #ddd;">
              <h2 style="color: #333; margin-top: 0;">Hello ${name},</h2>
              
              <p style="color: #555; line-height: 1.6;">
                Thank you for contacting InterviewPrep AI support! We have received your message and will get back to you as soon as possible.
              </p>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #555;">Your Request Details:</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Priority:</strong> ${priority}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <h4 style="margin-top: 0; color: #1e40af;">Expected Response Time</h4>
                <p style="margin-bottom: 0; color: #555;">
                  ${priority === 'urgent' ? 'We aim to respond to urgent requests within 4 hours.' :
                    priority === 'high' ? 'We aim to respond to high priority requests within 8 hours.' :
                        'We typically respond within 24 hours during business days.'}
                </p>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin-top: 20px;">
                In the meantime, you can check our FAQ section or documentation for immediate answers to common questions.
              </p>
              
              <p style="color: #555; line-height: 1.6;">
                Best regards,<br>
                <strong>The InterviewPrep AI Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
              <p>This is an automated response. Please do not reply to this email.</p>
            </div>
          </div>
        `
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        res.json({
            success: true,
            message: 'Your support request has been submitted successfully. We will get back to you soon!'
        });

    } catch (error) {
        console.error('Support email error:', error);

        if (error.response) {
            console.error('Resend API error response:', error.response.data);
            return res.status(500).json({
                success: false,
                message: `Email service error: ${error.response.data.message || 'Unknown error from email service'}`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to submit support request. Please try again or contact us directly.'
        });
    }
});// Get support statistics (optional - for admin dashboard)
router.get('/stats', async (req, res) => {
    try {
        // This could return statistics about support requests
        // For now, returning mock data
        res.json({
            success: true,
            data: {
                totalRequests: 0,
                pendingRequests: 0,
                resolvedRequests: 0,
                averageResponseTime: '2 hours'
            }
        });
    } catch (error) {
        console.error('Support stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch support statistics'
        });
    }
});

module.exports = router;

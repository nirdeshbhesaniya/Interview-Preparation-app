// Test script to verify Nodemailer configuration
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConnection() {
    try {
        console.log('Testing email configuration...');

        // Create transporter
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Verify connection
        await transporter.verify();
        console.log('✅ Email configuration is valid!');

        // Send test email
        const testEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Interview AI - Email Test',
            html: `
        <h2>Email Test Successful!</h2>
        <p>This is a test email from Interview AI support system.</p>
        <p>If you receive this email, the Nodemailer configuration is working correctly.</p>
        <hr>
        <small>Sent at: ${new Date().toLocaleString()}</small>
      `
        };

        const info = await transporter.sendMail(testEmail);
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);

    } catch (error) {
        console.error('❌ Email configuration error:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 Authentication failed. Please check:');
            console.log('   1. EMAIL_USER is correct');
            console.log('   2. EMAIL_PASS is an App Password (not your regular password)');
            console.log('   3. 2-factor authentication is enabled on your Google account');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n💡 Connection failed. Please check your internet connection.');
        }
    }
}

// Run the test
testEmailConnection();

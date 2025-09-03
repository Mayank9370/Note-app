const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }


  async sendOTP(email, otp, name) {
    try {
      const mailOptions = {
        from: {
          name: 'Notes App',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Verify Your Email - Notes App',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; margin: 0;">Notes App</h1>
              <p style="color: #6B7280; font-size: 16px;">Secure your account with email verification</p>
            </div>
            
            <div style="background: #F9FAFB; padding: 30px; border-radius: 10px; text-align: center;">
              <h2 style="color: #1F2937; margin-bottom: 20px;">Hello ${name}!</h2>
              <p style="color: #4B5563; font-size: 16px; margin-bottom: 30px;">
                Thank you for signing up! Please use the verification code below to complete your registration:
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #3B82F6;">
                <span style="font-size: 32px; font-weight: bold; color: #3B82F6; letter-spacing: 8px; font-family: monospace;">
                  ${otp}
                </span>
              </div>
              
              <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
                This code will expire in 10 minutes for security reasons.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #9CA3AF; font-size: 14px;">
                If you didn't request this verification, please ignore this email.
              </p>
              <p style="color: #9CA3AF; font-size: 12px; margin-top: 10px;">
                © 2024 Notes App. All rights reserved.
              </p>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: {
          name: 'Notes App',
          address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Welcome to Notes App!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; margin: 0;">Welcome to Notes App!</h1>
            </div>
            
            <div style="background: #F9FAFB; padding: 30px; border-radius: 10px;">
              <h2 style="color: #1F2937; margin-bottom: 20px;">Hello ${name}!</h2>
              <p style="color: #4B5563; font-size: 16px; line-height: 1.5;">
                Your account has been successfully verified! You can now start creating and managing your notes.
              </p>
              <p style="color: #4B5563; font-size: 16px; line-height: 1.5;">
                Thank you for choosing Notes App to organize your thoughts and ideas.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.CLIENT_URL}/dashboard" 
                 style="background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Start Taking Notes
              </a>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent successfully to ${email}`);
      return true;
    } catch (error) {
      console.error('Welcome email sending error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
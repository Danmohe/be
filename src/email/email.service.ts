// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendInvitationEmail(email: string, firstName: string, id: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      // configure your email provider here
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Invitation to Register',
      html: `
        <p>Hello ${firstName},</p>
        <p>You have been invited to register for our application.</p>
        <p>Please complete your registration by visiting the registration link.</p>
        <p><a href="https://whisker-sm.netlify.app/users/${id}/activation">Register using this link</a></p>
        <p>Thank you!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}
import nodemailer from "nodemailer";
import configs from "../configs";

class MailService {
  #transporter;
  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: configs.service.nodemailerHost,
      port: configs.service.nodemailerPort,
      auth: {
        user: configs.nodemailer.user,
        pass: configs.nodemailer.pass,
      },
    });
  }
  async sendEmail(userEmail, message) {
    await this.#transporter.sendMail({
      from: '"Karang Taruna App" <otp@ragdalion.com>',
      to: userEmail,
      subject: "OTP CODE",
      text: message,
      html: message,
    });
  }
}

export default new MailService();

// import nodemailer from "nodemailer";
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
export const sendOtpEmail = async ({ email, otp, }) => {
    if (!email || !otp) {
        throw new Error("Email and OTP are required");
    }
    const info = await transporter.sendMail({
        from: {
            name: "ChatApp",
            address: process.env.MAIL_FROM || process.env.SMTP_USER,
        },
        to: email,
        subject: "Your ChatApp Login OTP",
        text: `Your login OTP is ${otp}. It expires in 5 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>ChatApp Login Verification</h2>
                <p>Use the following OTP to log in:</p>
                <h1 style="letter-spacing: 8px;">${otp}</h1>
                <p>This OTP expires in 5 minutes.</p>
                <p>If you did not request this OTP, please ignore this email.</p>
            </div>
        `,
    });
    console.log(`OTP email sent. Message ID: ${info.messageId}`);
};

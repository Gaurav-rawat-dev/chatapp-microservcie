
// import nodemailer from "nodemailer";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();



interface SendOtpEmailInput {
    email: string;
    otp: string;
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});







export const sendOtpEmail = async ({
    email,
    otp,
}: SendOtpEmailInput): Promise<void> => {
    if (!email || !otp) {
        throw new Error("Email and OTP are required");
    }
    console.log(`Sending OTP email to ${email} with OTP: ${otp}=================`);
    const info = await transporter.sendMail({
        from: {
            name: "ChatApp",
            address: process.env.SMTP_USER!,
        },
        to: email,
        subject: "Your ChatApp Login OTP",
        text: `Your login OTP is ${otp}. It expires in 5 minutes.`,
        html : `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChatApp Login Verification</title>
</head>

<body style="margin:0;padding:0;background:#f3f4f6;
             font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0"
         cellspacing="0" border="0"
         style="background:#f3f4f6;padding:32px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellpadding="0"
               cellspacing="0" border="0"
               style="max-width:560px;background:#ffffff;
                      border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center"
                style="background:#111827;padding:36px 24px;">

              <div style="display:inline-block;background:#6366f1;
                          color:#ffffff;width:44px;height:44px;
                          line-height:44px;border-radius:12px;
                          font-size:23px;font-weight:bold;">
                C
              </div>

              <h1 style="color:#ffffff;font-size:26px;
                         margin:14px 0 8px;">
                ChatApp
              </h1>

              <p style="color:#c7d2fe;font-size:12px;
                        letter-spacing:2px;margin:0;">
                SECURE SIGN-IN
              </p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding:36px 28px 20px;text-align:center;">

              <h2 style="color:#111827;font-size:24px;
                         margin:0 0 12px;">
                Verify your email
              </h2>

              <p style="color:#6b7280;font-size:15px;
                        line-height:1.7;margin:0 0 28px;">
                Use the verification code below to securely
                sign in to your ChatApp account.
              </p>

              <!-- OTP card -->
              <table role="presentation" width="100%"
                     cellpadding="0" cellspacing="0" border="0"
                     style="background:#f5f3ff;
                            border:1px solid #ddd6fe;
                            border-radius:12px;">
                <tr>
                  <td align="center" style="padding:24px 12px;">

                    <p style="color:#6d28d9;font-size:12px;
                              font-weight:bold;letter-spacing:2px;
                              margin:0 0 16px;">
                      YOUR ONE-TIME PASSWORD
                    </p>

                    <p style="font-size:36px;font-weight:bold;
                              letter-spacing:8px;color:#4f46e5;
                              margin:0 0 18px;">
                      ${otp}
                    </p>

                    <span style="display:inline-block;
                                 background:#fef3c7;color:#92400e;
                                 padding:8px 14px;border-radius:20px;
                                 font-size:12px;font-weight:bold;">
                      Expires in 5 minutes
                    </span>

                  </td>
                </tr>
              </table>

              <p style="color:#6b7280;font-size:13px;
                        line-height:1.7;margin:26px 0 12px;">
                For your security, never share this code with
                anyone. ChatApp support will never ask you
                to disclose your OTP.
              </p>

              <p style="color:#9ca3af;font-size:12px;
                        line-height:1.6;margin:0;">
                If you didn't request this code, you can safely
                ignore this email. Your account remains secure.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
                style="background:#111827;padding:24px;">

              <p style="color:#ffffff;font-size:14px;
                        font-weight:bold;margin:0 0 8px;">
                ChatApp
              </p>

              <p style="color:#9ca3af;font-size:11px;
                        line-height:1.7;margin:0;">
                Secure conversations. Meaningful connections.<br>
                This is an automated email. Please do not reply.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
    });

    console.log(`OTP email sent. Message ID: ${info.messageId}`);

};

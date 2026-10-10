import nodemailer from 'nodemailer';

const createTransporter = () => {
    const {
        EMAIL_HOST,
        EMAIL_PORT,
        EMAIL_USER,
        EMAIL_PASSWORD
    } = process.env;

    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
        throw new Error(
        'Email Service Not Configured. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD.'
        );
    }

    return nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT || 587),
        secure: Number(EMAIL_PORT || 587) === 465,
        auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
        }
    });
};

export const sendOtpEmail = async ({ recipient, otp, purpose }) => {
    const transporter = createTransporter();

    const purposeLabel =
        purpose === 'registration' ? 'registration' : 'login';

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: recipient,
        subject: `Your ${purposeLabel} verification code`,
        text: `Your verification code is ${otp}. It expires in ${
        process.env.OTP_EXPIRES_MINUTES || 5
        } minutes.`,
        html: `
        <p>Your verification code is:</p>
        <h2>${otp}</h2>
        <p>This code expires in ${
            process.env.OTP_EXPIRES_MINUTES || 5
        } minutes.</p>
        <p>If you did not request this code, you can ignore this email.</p>
        `
    });
};



// import nodemailer from 'nodemailer';

// // ! Check if email configuration is available in environment variables
// const hasEmailConfig =
//     process.env.EMAIL_HOST &&
//     process.env.EMAIL_PASSWORD &&
//     process.env.EMAIL_USER &&
//     process.env.EMAIL_FROM;

// // ! Create a transporter object using nodemailer if email configuration is available
// const transporter = hasEmailConfig ? nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: Number(process.env.EMAIL_PORT) || 587, // Default to port 587 if not set
//     secure: Number(process.env.EMAIL_PORT) === 465, // Use secure connection for port 465
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// }) : null;

// export const sendOTPEmail = async (recipient, otp, purpose) => {
//     if (!transporter) {
//         throw new Error("❌ Email Service Not Configured. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASSWORD in your environment variables.");
//     }

//     const purposeLabel = purpose === "registration" ? "Registration" : "Password Reset";

//     await transporter.sendMail({
//         from: process.env.EMAIL_FROM,
//         to: recipient,
//         subject: `Your ${purposeLabel} Verification Code`,
//         text: `Your OTP for ${purposeLabel} is: ${otp}. This code will expire in ${process.env.OTP_EXPIRES_IN || 5} minutes. If you did not request this, please ignore this email.`,

//         //! HTML email
//         html: `p>Your verification code is:/p>h2> ${otp}/h2>p>This code will expire in ${process.env.OTP_EXPIRES_IN || 5} minutes.p>pIf you did not request this, please ignore this email./p>`
//     });

// }
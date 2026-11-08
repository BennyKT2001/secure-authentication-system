
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const getPurposeDetails = (purpose) => {
    const purposes = {
        registration: {
            label: "Registration",
            description: "complete your account registration"
        },
        login: {
            label: "Login",
            description: "complete your login verification"
        },
        passwordReset: {
            label: "Password Reset",
            description: "verify your identity and reset your password"
        }
    };

    return purposes[purpose] || {
        label: "Verification",
        description: "complete your verification"
    };
};

export const sendOtpEmail = async ({ recipient, otp, purpose }) => {
    const {
        BREVO_API_KEY,
        EMAIL_FROM,
        EMAIL_FROM_NAME
    } = process.env;

    if (!BREVO_API_KEY || !EMAIL_FROM) {
        throw new Error(
            "Email Service Not Configured. Please set BREVO_API_KEY and EMAIL_FROM."
        );
    }

    const purposeDetails = getPurposeDetails(purpose);
    const expiry = process.env.OTP_EXPIRES_IN || "5m";

    const payload = {
        sender: {
            name: EMAIL_FROM_NAME || "AssetGuard",
            email: EMAIL_FROM
        },
        to: [
            {
                email: recipient
            }
        ],
        subject: `AssetGuard - Your ${purposeDetails.label} Verification Code`,
        textContent: `Your AssetGuard verification code is ${otp}. Use this code to ${purposeDetails.description}. It expires in ${expiry}. If you did not request this code, please ignore this email.`,
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">AssetGuard Verification</h2>
                <p>Your verification code is:</p>
                <h1 style="letter-spacing: 6px; color: #2563eb;">${otp}</h1>
                <p>Use this code to ${purposeDetails.description}.</p>
                <p>This code expires in <strong>${expiry}</strong>.</p>
                <p>If you did not request this code, please ignore this email.</p>
                <hr />
                <p style="font-size: 12px; color: #777;">
                    AssetGuard - Secure Web-Based Asset Management
                </p>
            </div>
        `
    };

    const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorDetails = await response.text();

        console.error("Brevo email API error:", response.status, errorDetails);

        throw new Error(
            `Failed to send email through Brevo. HTTP status: ${response.status}`
        );
    }

    const result = await response.json();

    console.log(`OTP email successfully submitted to Brevo for ${recipient}.`);

    return result;
};
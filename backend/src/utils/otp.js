import crypto from "crypto";

// ! Generate a random 6-digit OTP
export const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString(); // Generates a 6-digit OTP
};

// !
export const getOTPexpiryDate = () => {
    const expiryMinutes = Number(process.env.OTP_EXPIRES_IN) || 5; // Default to 5 minutes if not set

    return new Date(Date.now() + expiryMinutes * 60 * 1000); // Returns a Date object representing the expiry time
};

// ! Crypto module is a built-in Node.js module that provides cryptographic functionality. It allows here to perform various cryptographic operations, such as generating random numbers, hashing data, and encrypting/decrypting information. In this code snippet, the crypto module is used to generate a random 6-digit OTP (One-Time Password) using the randomInt method.
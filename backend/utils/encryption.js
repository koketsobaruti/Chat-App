const crypto = require('crypto');
//var CryptoJS = require("crypto-js");

// Function to generate a random IV
const generateIV = () => {
    return crypto.randomBytes(8); // DES IV length is 8 bytes
};

// Encryption function
function encryptHex(hexString, key) {
    var plaintext = CryptoJS.enc.Hex.parse(hexString);
    var encrypted = CryptoJS.AES.encrypt(plaintext, key);
    return encrypted.toString();
}

// Decryption function
function decryptHex(encryptedHex, key) {
    var decrypted = CryptoJS.AES.decrypt(encryptedHex, key);
    return decrypted.toString(CryptoJS.enc.Hex);
}

// Function to encrypt the message
const encryptMessage = (message, secretKey) => {
    const iv = generateIV(); // Generate a random IV
    console.log(`Buffer iv: ${iv}`)
    const cipher = crypto.createCipheriv('des-ede3-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'), // Convert IV Buffer to hex string
        encrypted: encrypted
    };
};

// Function to decrypt the message
const decryptMessage = (encryptedData, secretKey) => {
    console.log(`encryptedData.iv: ${encryptedData.iv}`)
    const iv = Buffer.from(encryptedData.iv, 'hex'); // Convert IV from hex string back to buffer
    console.log(`Buffer iv: ${iv}`)
    try{
        const decipher = crypto.createDecipheriv('des-ede3-cbc', Buffer.from(secretKey), iv);
        let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }catch(err){
        console.log(`Error deciphering: \n${err}`)
    }
    
    
};

module.exports = { encryptMessage, decryptMessage, encryptHex, decryptHex };

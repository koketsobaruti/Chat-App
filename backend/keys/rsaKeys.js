const NodeRSA = require('node-rsa');
const fs = require('fs');

const generateKeyPair = () => {
    const key = new NodeRSA({ b: 512});

    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');

    fs.writeFileSync('keys/publicKey.pem', publicKey);
    fs.writeFileSync('keys/privateKey.pem', privateKey);
};

generateKeyPair();

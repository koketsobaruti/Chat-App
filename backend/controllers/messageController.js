const crypto = require('crypto');
const Message = require('../models/Message');
const User = require('../models/User');
const io = require('../app').io;
const { encryptMessage, decryptMessage } = require('../utils/encryption'); // Update the path as necessary
const secretKey = '0123456789abcdef01234567'; // Replace this with your actual secret key

exports.sendMessage = async (req, res) => {
    console.log('sendMessage called');
    const { from, to, content } = req.body;
    console.log(`From: ${from}`)
    console.log(`Secret Key (encryption): ${secretKey}`)
    try {
        const encryptedContent = encryptMessage(content, secretKey);
        console.log(`Encrypted: ${encryptedContent}`)

        const newMessage = new Message({ from, to, content: encryptedContent,  s_key:secretKey, });
        console.log(`New message object ${newMessage}`)

        await newMessage.save()
            .then(() => {
                console.log('Message saved in database');
                
                console.log('Message emitted');

                res.status(201).json({ message: 'Message sent successfully' });
            })
            .catch(saveError => {
                console.error('Error saving message:', saveError);
                res.status(500).json({ error: 'Failed to save message' });
            });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getMessages = async (req, res) => {
    const { userId } = req.params;
    //const { secretKey } = req.query;
    try {

        if (!secretKey) {
            return res.status(400).json({ error: 'Secret key is required.' });
        }
        console.log(`Fetching messages for user: ${userId}`);
        console.log(`Secret Key (decryption): ${secretKey}`)
        const messages = await Message.find({
            $or: [
                { from: userId },
                { to: userId }
            ]
        });
        console.log(`Fetched messages: ${messages}`);
        console.log('Decrypting message')
        /*const decryptedMessages = await Promise.all(messages.map(async msg => {
            const sender = await User.findById(msg.from);
            return {
                ...msg._doc,
                content: decryptMessage(msg.content, secretKey),
                fromUsername: sender.username // Add username to the message
            };
        }));*/
        /*const decryptedMessages = messages.map(message => {
            const decryptedContent = decryptMessage(message.content, secretKey);
            console.log('Decrypted content:', decryptedContent);
            return {
                ...message._doc,
                content: decryptedContent
            };
        });*/

        console.log(messages)
        const decryptedMessages = messages.map(message => {
            try {
                const decryptedContent = decryptMessage(message.content, message.s_key);
                console.log(`Decrypted content for message ${message._id}: ${decryptedContent}`);
                return {
                    ...message._doc,
                    content: decryptedContent
                };
            } catch (decryptionError) {
                console.error(`Error decrypting message ${message._id}:`, decryptionError);
                return {
                    ...message._doc,
                    content: 'Error decrypting message content'
                };
            }
        })

        res.json(decryptedMessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessages2 = async (req, res) => {
    const { userId } = req.params;
    const { secretKey } = req.body;
    try {
        const messages = await Message.find({ to: userId }).populate('from', 'username');
        const decryptedMessages = messages.map(message => ({
            from: message.from.username,
            content: decryptMessage(message.content, secretKey),
            timestamp: message.timestamp
        }));

        res.json(decryptedMessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
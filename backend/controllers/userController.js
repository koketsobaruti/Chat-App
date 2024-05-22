const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
var userService = require('../services/userService')

exports.register = async (req, res) => {
    
    try {
        console.log(req.body);
        //create a new user by passing the body to the createUserDBService function
        var status = await userService.createUserDBService(req.body);
        console.log(status)
        if (status) {
            res.send({ status: true, message: "USER CREATED SUCCEFULLY" });
          } else {
            res.send({ status: false, message: "ERROR CREATING USER" });
          }
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    var result = null;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        
        res.json({ token, user: { _id: user._id, username: user.username } });
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-name -password -rsaPrivateKey');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

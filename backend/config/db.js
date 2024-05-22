const mongoose = require('mongoose');
const uri = 'mongodb+srv://koketso:09_Aug_2001@cluster.cziosvm.mongodb.net/';
 
mongoose.connect(uri, { useNewUrlParser: true, 
    useUnifiedTopology: true }).then(() => 
        console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));
module.exports = mongoose;

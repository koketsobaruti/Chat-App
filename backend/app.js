const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('./config/db'); // Ensure this points to your correct db configuration
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path');
const cors = require('cors');
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Configure CORS middleware for Express
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

// Middleware to parse JSON
app.use(bodyParser.json());

// Add io to request object in middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello world');
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Socket.io setup
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle incoming messages from clients
  socket.on('sendMessage', (message) => {
    console.log('app: Received message:', message);
    // Handle the message and emit it to other clients if needed
    io.emit('receiveMessage', message);
  });

  // Handle receiving messages from clients
  socket.on('receiveMessage', (message) => {
    console.log('app: Received message from client:', message);
    // Process the received message if needed
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


const PORT = process.env.PORT || "5000";
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = { io };

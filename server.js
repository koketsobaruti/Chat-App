const app = require('./backend/app');
const fs = require('fs');
const http = require('https');
const normalizePort = val => {
    var port = parseInt(val,10);
  
    if (isNaN(port)){
      //named pipe
      return val;
    }
  
    if(port >=0){
      //port number
      return port;
    }
  
    return false;
  }
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
server.on("error" , onError);
server.on("listening", onListening);
server.listen(port)
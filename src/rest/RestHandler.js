const Request = require('./RequestHandler');

 class RestHandler {
   constructor(client) {
     this.client = client;
     this.handler = new Request(client);
   }
   
   get(path, options) {
     options.method = 'GET';
     this.handler.request(path, options)
   }
   
   post(path, options) {
     options.method = 'POST';
     this.handler.request(path, options);
   }
    
 }
 
 module.exports = RestHandler;

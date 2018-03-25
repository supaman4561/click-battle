var http = require('http');
var events = require('events');

var server = http.createServer();
var eventEmitter = new events.EventEmitter();

server.on('request', dispHelloWorld);
eventEmitter.on('click', responseClick);

function dispHelloWorld(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("Hello World");
    res.end();
}

function responseClick() {
    console.log("clicked");
}

server.listen(8080, '0.0.0.0', () => {
    var addr = server.address();
    console.log("Click-Battle server listening at", addr.address + ":" + addr.port); 
});
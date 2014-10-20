/*
 * Monitor remote server uptime.
 */

var http = require('http');
var url  = require('url');

http.createServer(function(req, res) {
<<<<<<< HEAD
  var arg = url.parse(req.url).pathname.substr(1);
  var chanceToGetOkResponse = parseFloat(arg) / 100;
  if (!chanceToGetOkResponse || Math.random() > chanceToGetOkResponse) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    setTimeout(function() { res.end('Bad Request')}, Math.random() * 1000 );
  } else {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    setTimeout(function() { res.end('Success')}, Math.random() * 1000 );
  }
}).listen(8888);
=======
  var message = new Date() + ' Request: ' + req.url + ' ';
  var duration = Math.random() * 1000;
  var arg = url.parse(req.url).pathname.substr(1);
  var chanceToGetOkResponse = parseFloat(arg) / 100;
  if (!chanceToGetOkResponse || Math.random() > chanceToGetOkResponse) {
    console.log(message + 'Responding NOK in ' + parseInt(duration, 10) + 'ms');
    res.writeHead(500, {'Content-Type': 'text/plain'});
    setTimeout(function() { res.end('Bad Request'); }, duration);
  } else {
    console.log(message + 'Responding OK in ' + parseInt(duration, 10) + 'ms');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    setTimeout(function() { res.end('Success'); }, duration);
  }
}).listen(8888);

console.log('Dummy server started on port 8888');
>>>>>>> d9cc96cc835b65577e9bc8c94625eb2706a1b923

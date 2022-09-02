const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

console.log('open http://localhost:5500');

http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    let filename = "." + q.pathname;
    if (filename == './') filename = './index.html'

    let extname = path.extname(filename);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.ico':
            contentType = 'image/ico';
            break;
        case '.json':
            contentType = 'text/json';
            break;
    }
    
    fs.readFile(filename, function(err, data) {
        if (err) {
          res.writeHead(404, {'Content-Type': contentType});
          return res.end("404 Not Found");
        }  
        res.writeHead(200, {'Content-Type': contentType});
        res.write(data);
        return res.end();
      });

      qdata = q.query;

      if(qdata.rating !=null){
        console.log(qdata.rating);
      };
    
}).listen(5500)
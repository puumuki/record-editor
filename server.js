const {createServer} = require('https');
const {parse} = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const port = parseInt(process.env.PORT || '3000', 10)
const hostname = 'localhost';
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

let options = {};

if( dev ) {  
  options = {
    cert: fs.readFileSync(path.resolve( 'certificate','localhost.pem')),
    key: fs.readFileSync(path.resolve( 'certificate','localhost-key.pem')),    
  };
}

app.prepare().then(() => {
  createServer(options, async (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  console.log(
    `> Server listening at https://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
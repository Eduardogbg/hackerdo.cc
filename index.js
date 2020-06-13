const http = require('http');
const fs = require('fs');


const index = fs.readFileSync('./index.html');
const DOKA = fs.readFileSync('./DOKA.jpeg');
const skrr = fs.readFileSync('./skrr.mp4');
const length = skrr.length;

function serveIndex(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(index);
}

function serveDOKA(req, res) {
  res.writeHead(200, { 'Content-Type': 'image/jpeg' });
  res.end(DOKA);

  console.log('DOKA in the house');
}

function serveSkrr(req, res) {
  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(200, head);
  skrr.pipe(res);
}

function streamSkrr(req, res) {
  const range = req.headers.range;
  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : length  - 1;

  const chunksize = end - start + 1;
  
  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${length}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': 'video/mp4'
  });

  const chunk = skrr.slice(start, end + 1);
  res.end(chunk);
}

function handleSkrrRequest(req, res) {
  const { headers: { range } } = req; 

  if (range) {
    streamSkrr(req, res);
  } else {
    serveSkrr(req, res);
  }
}

const server = http.createServer((req, res) => {
  if (req.url == '/' || req.url == '/index.html') {
    serveIndex(req, res);
  } else if (req.url == '/DOKA.jpeg') {
    serveDOKA(req, res);
  } else if (req.url == '/skrr.mp4') {
    handleSkrrRequest(req, res);
  } else {
    res.writeHead(404);
  }
});

server.listen(3001, () => {
  console.log('hackerdo.cc tá na área');
});

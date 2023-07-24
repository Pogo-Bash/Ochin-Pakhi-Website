import http from 'http';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const port = process.env.PORT || 8080;

const server = http.createServer();

server.on('request', async (req, res) => {
  const filePath = req.url === '/' ? './build/index.html' : './build' + req.url;
  const extname = path.extname(filePath);
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
    case '.wav':
      contentType = 'audio/wav';
      break;
  }

  if (req.url === '/api') {
    const apiEndpoint = '';
    const apiToken = 'a62954ec82918226a4a9f8a9fbcbfedf85a76c911bc018201d70709065859a9a31086162da99099e3350c62019db7f748b92b4433cff40f1c908b0de2df963ae33fd36c7f4625b56c35e5681339c0ffb538b7a1a4aa9e8197577825d5baa85830bca45f31578a6f3433b633ee3eb714234a4960b53f757ee7a5d26250d47a23f';

    try {
      const response = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(response.status);
        res.end(`API request failed with status ${response.status}`);
      }
    } catch (error) {
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  } else {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('404 Not Found why');
        } else {
          res.writeHead(500);
          res.end('500 Internal Server Error');
        }
      } else {
        if (extname === '.png' || extname === '.jpg') {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'binary');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      }
    });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

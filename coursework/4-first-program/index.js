import chalk from 'chalk';
import http from 'http';
import fs from 'fs';
import path from 'path';

const mimeTypes = {
  '.html': 'text/html',
  '.txt': 'text/plain',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
};

const server = http.createServer((request, response) => {
  const fileName = request.url.substring(1);
  const filePath = path.join('public', fileName);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // If no file name is provided, serve the index.html file
  if (!fileName) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync('index.html'));
    return;
  }

  fs.readFile(filePath, (error, data) => {
    // If there is no error, send the file with the correct content type
    if (!error) {
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(data);
      return;
    }

    // If the file is not found, send a 404 error with the 404.html page
    const isFileMissing = error.code === 'ENOENT';
    if (isFileMissing) {
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.end(fs.readFileSync('404.html'));
      return;
    }

    // If there is another error, send a 500 error with a generic message
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end('500 Internal Server Error');
    return;
  });
});

server.listen(8080, 'localhost', () => {
  console.log(chalk.yellow('Server started on http://localhost:8080'));
});

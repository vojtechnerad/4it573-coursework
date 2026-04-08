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

  try {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        const isFileMissing = error.code === 'ENOENT';
        if (isFileMissing) {
          response.writeHead(404, { 'Content-Type': 'text/plain' });
          response.end(
            `404 Not Found - The requested file "${fileName}" was not found on this server.`,
          );
        } else {
          response.writeHead(500, { 'Content-Type': 'text/plain' });
          response.end('500 Internal Server Error');
        }
      } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(data);
      }
    });
  } catch (e) {
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end('500 Internal Server Error');
  }
});

server.listen(8080, 'localhost', () => {
  console.log(chalk.yellow('Server started on http://localhost:8080'));
});

import http from 'http';
import { dbConnection } from './db.js';
import productModel from './models/productModel.js';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
dbConnection();

const server = http.createServer(async (req, res) => {
    if (req.url === '/product' && req.method === 'GET') {
        const product = await productModel.find();

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        fs.readFile(path.join(__dirname, 'views', 'index.hbs'), 'utf8', (err, data) => {
            if (err) {
                return res.end('Internal Server Error');
            } else {
                const template = handlebars.compile(data);

                const context = { title: 'Products', product };

                const html = template(context);

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            }
        });

    } else if (req.url === '/product' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const newItem = JSON.parse(body);
            const item = new productModel(newItem);
            item.save();
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(item));
        });

    } else if (req.url.startsWith('/product/') && req.method === 'PUT') {
        const itemId = req.url.split('/')[2];

        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            const updatedItem = JSON.parse(body);
            const data = await productModel.findByIdAndUpdate(itemId, updatedItem, { new: true });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        });

    } else if (req.url.startsWith('/product/') && req.method === 'DELETE') {
        const itemId = req.url.split('/')[2];
        await productModel.findByIdAndRemove(itemId);
        res.writeHead(204);
        res.end(JSON.stringify({ success: 'Product Deleted' }));
    }
});

server.listen(4000, () => {
    console.log(`Server Started`);
});

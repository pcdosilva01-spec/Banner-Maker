/**
 * Simple Node.js Proxy Server para NVIDIA API
 * Contorna limitações de CORS para développement local
 *
 * Uso: node proxy-server.js
 * Porta: 3000
 */

const http = require('http');
const https = require('https');

const PORT = 3000;
const NVIDIA_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';

// API Key - mesma do .env
const NVIDIA_API_KEY = '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';

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Apenas POST para /api/generate
    if (req.method === 'POST' && req.url === '/api/generate') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const url = new URL(NVIDIA_ENDPOINT);

            const options = {
                hostname: url.hostname,
                port: 443,
                path: url.pathname + url.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${NVIDIA_API_KEY}`,
                    'Accept': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                },
            };

            const proxyReq = https.request(options, (proxyRes) => {
                let proxyBody = '';

                proxyRes.on('data', chunk => {
                    proxyBody += chunk.toString();
                });

                proxyRes.on('end', () => {
                    // Pass through status
                    res.writeHead(proxyRes.statusCode, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    });
                    res.end(proxyBody);
                });
            });

            proxyReq.on('error', (error) => {
                console.error('Erro no proxy:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            });

            proxyReq.write(body);
            proxyReq.end();
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Proxy Server rodando em http://localhost:${PORT}`);
    console.log(`\nEndpoints:`);
    console.log(`  POST /api/generate - NVIDIA Chat Completions`);
    console.log(`\nConfigure no frontend:`);
    console.log(`  AI_ENDPOINT = 'http://localhost:3000/api/generate'`);
});
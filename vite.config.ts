import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function wtfDevGatewayPlugin() {
  return {
    name: 'wtf-dev-gateway-plugin',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        if (url.pathname === '/api/diagram' && req.method === 'GET') {
          const localFile = path.resolve(__dirname, '.wtf/schemas/current.json');
          if (fs.existsSync(localFile)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(fs.readFileSync(localFile, 'utf-8'));
            return;
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'No schema found' }));
          return;
        }

        if (url.pathname === '/api/diagram' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              const schemasDir = path.resolve(__dirname, '.wtf/schemas');
              if (!fs.existsSync(schemasDir)) {
                fs.mkdirSync(schemasDir, { recursive: true });
              }
              fs.writeFileSync(path.resolve(schemasDir, 'current.json'), body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Saved to .wtf/schemas/current.json' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (url.pathname === '/api/events') {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
          res.write(': connected\n\n');
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), wtfDevGatewayPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

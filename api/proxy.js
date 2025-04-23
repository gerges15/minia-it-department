import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  let target =
    process.env.VITE_API_URL || 'http://graduationprojecthost.runasp.net';

  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/api/proxy': '', // Remove the /api/proxy prefix
    },
    onProxyRes: function (proxyRes, req, res) {
      console.log('PROXY RES:', proxyRes.statusCode);
    },
    onError: function (err, req, res) {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Proxy error: ' + err.message);
    },
  });

  return proxy(req, res);
}

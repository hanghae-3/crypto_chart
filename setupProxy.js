import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
	app.use(
		createProxyMiddleware('/api', {
			target: 'http://43.203.82.210:8080',
			changeOrigin: true,
		}),
	);
}

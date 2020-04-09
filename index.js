const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const WebSocketServer = WebSocket.Server;

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
	console.log('New connection');

	ws.isAlive = true;

	ws.on('close', () => {
		console.log('Connection closed');
	});

	ws.on('message', (message) => {
		if (message === 'pong') {
			ws.isAlive = true;
			return;
		}

		console.log('Broadcasting message', message);
		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN && client !== ws) {
				client.send(message);
			}
		});
	});
});

const pingInterval = setInterval(() => {
	wss.clients.forEach(ws => {
		if (!ws.isAlive) {
			console.log('Didn\'t receive pong');
			ws.terminate();
			return;
		}

		ws.isAlive = false;
		ws.send('ping');
	});
}, 16000);

wss.on('close', () => { clearInterval(pingInterval); });

wss.on('listening', () => {
	console.log('WS Listening', wss.address());
});

app.use(express.static('.'));

server.listen(3000, '::1', () => {
	const address = server.address();
	console.log('HTTP Listening', address);
});

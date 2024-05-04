export const getMarketList = async () => {
	const res = await fetch('https://api.upbit.com/v1/market/all');
	const data = await res.json();
	return data.filter((item) => item.market.includes('KRW')).map((item) => item);
};

export const connectWebSocket = (marketCodes: string[], onMessage) => {
	const socket = new WebSocket('wss://api.upbit.com/websocket/v1');
	socket.onopen = () => {
		const message = JSON.stringify([{ ticket: 'uniqueTicket' }, { type: 'ticker', codes: marketCodes }]);
		socket.send(message);
	};

	socket.onmessage = (event) => {
		const reader = new FileReader();
		reader.onload = () => {
			const data = JSON.parse(reader.result);
			onMessage(data);
		};
		reader.readAsText(event.data);
	};

	return socket;
};

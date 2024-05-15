class WebSocketService {
	static instance: WebSocketService | null = null;
	socket: WebSocket | null = null;

	static getInstance(): WebSocketService {
		if (!WebSocketService.instance) {
			WebSocketService.instance = new WebSocketService();
		}
		return WebSocketService.instance;
	}

	connect(marketCodes: string[], onMessage: (data: any) => void): void {
		if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {

			this.socket = new WebSocket('wss://api.upbit.com/websocket/v1');
			this.socket.onopen = () => {
				const message = JSON.stringify([{ ticket: 'uniqueTicket' }, { type: 'ticker', codes: marketCodes }]);
				this.socket?.send(message);
			};

			this.socket.onmessage = (event) => {
				const reader = new FileReader();
				reader.onload = () => {
					const data = JSON.parse(reader.result as string);
					onMessage(data);
				};
				reader.readAsText(event.data);
			};

			this.socket.onclose = () => {
				this.socket = null;
				// 자동 재연결 로직을 추가하려면 여기서 connect를 호출합니다.
				this.connect(marketCodes, onMessage);
			};

			this.socket.onerror = (error) => {
				console.error('WebSocket Error:', error);
				this.socket?.close();
			};
		}
	}

	disconnect(): void {
		if (this.socket) {
			this.socket.close();
			this.socket = null;
		}
	}
}

export default WebSocketService;

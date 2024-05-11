// 필요한 경우 WebSocket 타입을 브라우저의 내장 객체에서 가져옵니다.
// 만약 서버 사이드에서 실행되는 경우, 'ws' 라이브러리 등을 사용할 수 있습니다.
// import { WebSocket } from 'ws'; // Node.js 환경에서 사용하는 경우

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
				this.socket.send(message);
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

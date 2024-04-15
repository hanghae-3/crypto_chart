// WebSocket을 활용하여 거래 데이터를 획득

import { useEffect, useRef, useState } from 'react';
import { throttle } from 'lodash';
import type { ITrade, ImarketCodes, TROptionsInterface } from '../../types/crypto';
import updateQueueBuffer from '../../utils/updateQueueBuffer';
import isMarketCodes from '../../utils/isMarketCodes';

function useGetTrade(
	targetMarketCodes: ImarketCodes,
	onError?: (error: Error) => void,
	options: TROptionsInterface = {},
) {
	const { throttle_time = 400, max_length_queue = 10, debug = false } = options;
	const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';
	const socket = useRef<WebSocket | null>(null);
	const buffer = useRef<ITrade[]>([]);

	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [socketData, setSocketData] = useState<ITrade[]>();

	const throttled = throttle(() => {
		try {
			const updatedBuffer = updateQueueBuffer(buffer.current, max_length_queue);
			buffer.current = updatedBuffer;
			setSocketData(updatedBuffer);
		} catch (error) {
			console.error(error);
		}
	}, throttle_time);

	// Socket 설정
	useEffect(() => {
		try {
			if (targetMarketCodes && !isMarketCodes(targetMarketCodes)) {
				throw new Error('targetMarketCodes does not have the correct interface');
			}
			console.log(targetMarketCodes);
			if ([targetMarketCodes].length > 0 && !socket.current) {
				socket.current = new WebSocket(SOCKET_URL);
				socket.current.binaryType = 'arraybuffer';

				// 소켓 오픈
				const socketOpenHandler = () => {};

				// 소켓 닫음
				const socketCloseHandler = () => {};

				// 소켓 에러
				const socketErrorHandler = (event: Event) => {
					const error = (event as ErrorEvent).error as Error;
					console.error(`[Error] ${error}`);
				};

				// 소켓 메시지
				const socketMsgHandler = () => {};

				socket.current.onopen = socketOpenHandler;
				socket.current.onclose = socketCloseHandler;
				socket.current.onerror = socketErrorHandler;
				socket.current.onmessage = socketMsgHandler;
			}
			return () => {
				if (socket.current) {
					if (socket.current.readyState != 0) {
						socket.current.close();
						socket.current = null;
					}
				}
			};
		} catch (error) {
			if (error instanceof Error) {
				if (onError) {
					onError(error);
				} else {
					console.error(error);
					throw error;
				}
			}
		}
	}, [targetMarketCodes]);

	return { socket: socket.current, isConnected, socketData };
}

export default useGetTrade;

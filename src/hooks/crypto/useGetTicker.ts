import { useEffect, useRef, useState } from 'react';
import { ITicker, ImarketCodes, TKOptionsInterface } from '../../types/crypto';
import { throttle } from 'lodash';
import sortBuffers from '../../utils/sortBuffers';
import getLastBuffers from '../../utils/getLastBuffers';
import isArrayOfMarketCodes from '../../utils/isArrayOfMarketCodes';
import encodeSocketData from '../../utils/encodeSocketData';
import updateSocketData from '../../utils/updateSocketData';

function useGetTicker(
	targetMarketCodes: ImarketCodes[],
	onError?: (error: Error) => void,
	options: TKOptionsInterface = {},
) {
	const { throttle_time = 400, debug = false } = options;
	const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';
	const socket = useRef<WebSocket | null>(null);
	const buffer = useRef<ITicker[]>([]);

	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [loadingBuffer, setLoadingBuffer] = useState<ITicker[]>([]);
	const [socketData, setSocketData] = useState<ITicker[] | null>(null);

	const throttled = throttle(() => {
		try {
			const lastBuffers = getLastBuffers(buffer.current, targetMarketCodes.length);

			const sortedBuffers = sortBuffers(lastBuffers, targetMarketCodes);

			sortedBuffers && setLoadingBuffer(sortedBuffers);
			buffer.current = [];
		} catch (error) {
			console.error(error);
			return;
		}
	}, throttle_time);

	// socket 세팅
	useEffect(() => {
		try {
			if (targetMarketCodes.length > 0 && !isArrayOfMarketCodes(targetMarketCodes)) {
				throw new Error('targetMarketCodes does not have the correct interface');
			}
			if (targetMarketCodes.length > 0 && !socket.current) {
				socket.current = new WebSocket(SOCKET_URL);
				socket.current.binaryType = 'arraybuffer';

				const socketOpenHandler = () => {
					setIsConnected(true);
					if (debug) console.log('[completed connect] | socket Open Type: ', 'ticker');
					if (socket.current?.readyState == 1) {
						const sendContent = [
							{ ticket: 'test' },
							{
								type: 'ticker',
								codes: targetMarketCodes.map((code) => code.market),
							},
						];
						socket.current.send(JSON.stringify(sendContent));
						if (debug) console.log('message sending done');
					}
				};

				const socketCloseHandler = () => {
					setIsConnected(false);
					setLoadingBuffer([]);
					setSocketData(null);
					buffer.current = [];
					if (debug) console.log('connection closed');
				};

				const socketErrorHandler = (event: Event) => {
					const error = (event as ErrorEvent).error as Error;
					console.error('[Error]', error);
				};

				const socketMessageHandler = (evt: MessageEvent<ArrayBuffer>) => {
					const data = encodeSocketData<ITicker>(evt.data);
					if (debug) console.log('data:', data);
					data && buffer.current.push(data);
					throttled();
				};

				socket.current.onopen = socketOpenHandler;
				socket.current.onclose = socketCloseHandler;
				socket.current.onerror = socketErrorHandler;
				socket.current.onmessage = socketMessageHandler;
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

	useEffect(() => {
		try {
			if (loadingBuffer.length > 0) {
				if (!socketData) {
					setSocketData(loadingBuffer);
				} else {
					setSocketData((prev) => {
						return prev && updateSocketData(prev, loadingBuffer);
					});
					setLoadingBuffer([]);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}, [loadingBuffer]);

	return { socket: socket.current, isConnected, socketData };
}

export default useGetTicker;

import { useEffect, useRef, useState } from 'react';
import { IOrderbook, ImarketCodes, OBOptionsInterface } from '../../types/crypto';
import encodeSocketData from '../../utils/encodeSocketData';
import { throttle } from 'lodash';
import getLastBuffers from '../../utils/getLastBuffers';
import isMarketCodes from '../../utils/isMarketCodes';

function useGetOrder(
	targetMarketCodes: ImarketCodes,
	onError?: (error: Error) => void,
	option: OBOptionsInterface = {},
) {
	const { throttle_time = 400, debug = false } = option;
	const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';

	const socket = useRef<WebSocket | null>(null);
	const buffer = useRef<IOrderbook[]>([]);

	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [socketData, setSocketData] = useState<IOrderbook>();

	const throttled = throttle(() => {
		try {
			const lastBuffers = getLastBuffers(buffer.current, [targetMarketCodes].length);
			lastBuffers && setSocketData(lastBuffers[0]);
			buffer.current = [];
		} catch (error) {
			console.error(error);
		}
	}, throttle_time);

	// socket 세팅
	useEffect(() => {
		try {
			if (targetMarketCodes && !isMarketCodes(targetMarketCodes)) {
				throw new Error('targetMarketCodes does not have the correct interface');
			}
			if ([targetMarketCodes].length > 0 && !socket.current) {
				socket.current = new WebSocket(SOCKET_URL);
				socket.current.binaryType = 'arraybuffer';

				const socketOpenHandler = () => {
					setIsConnected(true);
					if (debug) console.log('[completed connect] | socket Open Type: ', 'orderbook');
					if (socket.current?.readyState == 1) {
						const sendContent = [
							{ ticket: 'test' },
							{
								type: 'orderbook',
								codes: [targetMarketCodes.market],
							},
						];
						socket.current.send(JSON.stringify(sendContent));
						if (debug) console.log('message sending done');
					}
				};

				const socketCloseHandler = () => {
					setIsConnected(false);
					setSocketData(undefined);
					buffer.current = [];
					if (debug) console.log('connection closed');
				};

				const socketErrorHandler = (event: Event) => {
					const error = (event as ErrorEvent).error as Error;
					if (debug) console.error('[Error]', error);
				};

				const socketMessageHandler = (evt: MessageEvent<ArrayBuffer>) => {
					const data = encodeSocketData<IOrderbook>(evt.data);
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

	return { socket: socket.current, isConnected, socketData };
}

export default useGetOrder;

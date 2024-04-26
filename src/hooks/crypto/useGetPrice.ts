import { useEffect, useRef, useState } from 'react';
import { ITicker, ImarketCodes, OBOptionsInterface } from '../../types/crypto';
import { throttle } from 'lodash';
import isMarketCodes from '../../utils/isMarketCodes';
import encodeSocketData from '../../utils/encodeSocketData';
import getLastBuffers from '../../utils/getLastBuffers';

export function useGetPrice(
	targetMarketCodes: ImarketCodes,
	onError?: (error: Error) => void,
	option: OBOptionsInterface = {},
) {
	const { throttle_time = 400, debug = false } = option;
	const SOCKET_URL = 'wss://api.upbit.com/websocket/v1';

	const socket = useRef<WebSocket | null>(null);
	const buffer = useRef<ITicker[]>([]);

	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [socketData, setSocketData] = useState<ITicker[]>();

	const throttled = throttle(() => {
		try {
			const lastBuffers = getLastBuffers(buffer.current, [targetMarketCodes].length);
			lastBuffers.length > 0 &&
				socketData?.at(-1)?.timestamp !== lastBuffers[0].timestamp &&
				setSocketData((prev) => {
					// if (prev?.at(-1)?.timestamp === lastBuffers[0].timestamp) return prev;
					return prev ? [...prev, ...lastBuffers] : lastBuffers;
				});
			buffer.current = [];
		} catch (error) {
			console.error(error);
		}
	}, throttle_time);

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
					if (debug) console.log('[completed connect] | socket Open Type: ', 'ticker');
					if (socket.current?.readyState == 1) {
						const sendContent = [
							{ ticket: 'test' },
							{
								type: 'ticker',
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
				const socketMessageHandler = (evt: MessageEvent<ArrayBuffer>) => {
					const data = encodeSocketData<ITicker>(evt.data);
					// const timestamp = data?.timestamp as number;
					// console.log(new Date(timestamp));

					data && buffer.current.push(data);
					throttled();
				};

				const socketErrorHandler = (event: Event) => {
					const error = (event as ErrorEvent).error as Error;
					console.error('[Error]', error);
				};
				socket.current.onopen = socketOpenHandler;
				socket.current.onclose = socketCloseHandler;
				socket.current.onerror = socketErrorHandler;
				socket.current.onmessage = socketMessageHandler;
			}
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

	return {
		socket: socket.current,
		isConnected,
		socketData,
	};
}

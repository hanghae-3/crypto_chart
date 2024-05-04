export const UPBIT_MARKET_CODE_REST_URL = 'https://api.upbit.com/v1/market/all?isDetails=false';

type Props = {
	marketCode: string;
	date: string;
	count: number;
	type: { time: 'days' } | { time: 'minutes'; sequence: 1 | 3 | 5 | 15 | 30 | 60 };
};

/**
 * UPBIT_CANDLE_REST_URL
 * @params {string} marketCode - 마켓 코드
 * @params {string} date - [YYYY-MM-DD]T[HH:mm:ss]Z 형태
 * @params {number} count - 요청 개수
 * @Params {object} type - { time: 'days' } | { time: 'minutes'; count: 1 | 3 | 5 | 15 | 30 | 60 } - 캔들 타입
 *
 * @returns {string} UPBIT_CANDLE_REST_URL
 */
export const UPBIT_CANDLE_REST_URL = ({
	marketCode = 'KRW-BTC',
	date = '2024-04-30T09:00:00Z',
	count = 200,
	type,
}: Props): string => {
	if (type.time === 'minutes') {
		// return `https://api.upbit.com/v1/candles/minutes/${type.sequence}?market=${marketCode}&count=${count}&convertingPriceUnit=KRW`;
		// return `https://api.upbit.com/v1/candles/minutes/${type.sequence}?market=${marketCode}&to=${date}&count=${count}&convertingPriceUnit=KRW`;
		return `https://api.upbit.com/v1/candles/minutes/${type.sequence}?market=${marketCode}&to=${date.split('Z')[0]}%2B09:00&count=${count}&convertingPriceUnit=KRW`;
	} else {
		return `https://api.upbit.com/v1/candles/days?market=${marketCode}&to=${date}&count=${count}&convertingPriceUnit=KRW`;
	}
};

export const UPBIT_WSS_URL = 'wss://api.upbit.com/websocket/v1';

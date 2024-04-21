import { ImarketCodes } from '../../../../types/crypto';

export const invalidCodes = [
	{
		market: 'KRW-BTC',
		korean_name: '비트코인',
		english_name: 'Bitcoin',
	},
	{
		market: 'KRW-ETH',
		korean_name: '이더리움',
	},
] as unknown as ImarketCodes[];

export const validCodes: ImarketCodes[] = [
	{
		market: 'KRW-BTC',
		korean_name: '비트코인',
		english_name: 'Bitcoin',
	},
];

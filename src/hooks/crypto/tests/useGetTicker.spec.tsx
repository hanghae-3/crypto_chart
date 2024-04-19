import { renderHook } from '@testing-library/react';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useGetTicker from '../useGetTicker';
import WS from 'vitest-websocket-mock';

describe('useGetTicker', () => {
	describe('훅 테스트', () => {
		let onError: Mock<any, any>;
		beforeEach(() => {
			onError = vi.fn();
		});
		afterEach(() => {
			onError.mockClear();
		});
		it('정확하지 않은 마켓코드를 사용하면 에러를 반환합니다.', () => {
			const invalidCodes = [
				{
					market: 'KRW-BTC',
					korean_name: '비트코인',
					english_name: 'Bitcoin',
				},
				{
					market: 'KRW-ETH',
					korean_name: '이더리움',
				},
			];

			renderHook(() => useGetTicker(invalidCodes, onError));
			expect(onError).toHaveBeenCalledTimes(1);
			expect(onError.mock.calls[0][0].message).toBe('targetMarketCodes does not have the correct interface');
		});

		it('정확한 마켓코드를 사용하면 데이터를 반환합니다.', async () => {
			const server = new WS('wss://api.upbit.com/websocket/v1', { jsonProtocol: true });

			const validCodes = [
				{
					market: 'KRW-BTC',
					korean_name: '비트코인',
					english_name: 'Bitcoin',
				},
			];

			const { result } = renderHook(() => useGetTicker(validCodes, onError));

			await server.connected;
			// 서버가 메시지를 받고, 에러가 발생하지 않았는지 확인합니다.
			await expect(server).toReceiveMessage([{ ticket: 'test' }, { codes: ['KRW-BTC'], type: 'ticker' }]);
			expect(onError).not.toHaveBeenCalled();
			// 서버가 메시지를 보내고, 연결이 성공했는지 확인합니다.
			server.send(socketResponse);

			await vi.waitUntil(async () => {
				return result.current.isConnected === true;
			});

			expect(result.current.socket).not.toBeNull();
		});
	});
});

const socketResponse = [
	{
		type: 'ticker',
		code: 'KRW-BTC',
		opening_price: 91439000,
		high_price: 92500000,
		low_price: 90000000,
		trade_price: 90691000,
		prev_closing_price: 91419000,
		acc_trade_price: 239404196315.0805,
		change: 'FALL',
		change_price: 728000,
		signed_change_price: -728000,
		change_rate: 0.0079633337,
		signed_change_rate: -0.0079633337,
		ask_bid: 'BID',
		trade_volume: 0.00275658,
		acc_trade_volume: 2628.53062845,
		trade_date: '20240418',
		trade_time: '094401',
		trade_timestamp: 1713433441950,
		acc_ask_volume: 1409.53053716,
		acc_bid_volume: 1219.00009129,
		highest_52_week_price: 105000000,
		highest_52_week_date: '2024-03-14',
		lowest_52_week_price: 32510000,
		lowest_52_week_date: '2023-06-15',
		market_state: 'ACTIVE',
		is_trading_suspended: false,
		delisting_date: null,
		market_warning: 'NONE',
		timestamp: 1713433441983,
		acc_trade_price_24h: 762543945928.6066,
		acc_trade_volume_24h: 8307.98502547,
		stream_type: 'SNAPSHOT',
	},
];

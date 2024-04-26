/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from '@testing-library/react';
import { invalidCodes, validCodes } from './mocks/invalidMarketCodes';
import useGetTrade from '../useGetTrade';
import { Mock } from 'vitest';
import WS from 'vitest-websocket-mock';

describe('useGetTrade 훅은', () => {
	let onError: Mock<any, any>;

	beforeEach(() => {
		onError = vi.fn();
	});

	afterEach(() => {
		onError.mockClear();
	});

	it('올바르지 못한 마켓코드를 입력으로 받으면, 에러를 반환합니다.', () => {
		const invalidMarketCodes = invalidCodes;

		renderHook(() => useGetTrade(invalidMarketCodes[1], onError));
		expect(onError).toHaveBeenCalledTimes(1);
		expect(onError.mock.calls[0][0].message).toBe('targetMarketCodes does not have the correct interface');
	});

	it('정확한 마켓코드를 사용하면 데이터를 반환합니다.', async () => {
		const server = new WS('wss://api.upbit.com/websocket/v1', { jsonProtocol: true });
		const validMarketCodes = validCodes;

		const { result } = renderHook(() => useGetTrade(validMarketCodes[0], onError));

		await server.connected;
		await expect(server).toReceiveMessage([{ ticket: 'test' }, { codes: ['KRW-BTC'], type: 'trade' }]);

		await waitFor(() => {
			expect(result.current.isConnected).toBeTruthy();
		});
		expect(result.current.isConnected).toBe(true);
		expect(result.current.socket).not.toBeNull();
	});
});

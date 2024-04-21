/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from '@testing-library/react';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useGetTicker from '../useGetTicker';
import WS from 'vitest-websocket-mock';
import { socketResponse } from './mocks/socketResponse';
import { invalidCodes, validCodes } from './mocks/invalidMarketCodes';

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
			const invalidMarketCodes = invalidCodes;

			renderHook(() => useGetTicker(invalidMarketCodes, onError));
			expect(onError).toHaveBeenCalledTimes(1);
			expect(onError.mock.calls[0][0].message).toBe('targetMarketCodes does not have the correct interface');
		});

		it('정확한 마켓코드를 사용하면 데이터를 반환합니다.', async () => {
			const server = new WS('wss://api.upbit.com/websocket/v1', { jsonProtocol: true });

			const validMarketCodes = validCodes;

			const { result } = renderHook(() => useGetTicker(validMarketCodes, onError));

			await server.connected;
			// 서버가 메시지를 받고, 에러가 발생하지 않았는지 확인합니다.
			await expect(server).toReceiveMessage([{ ticket: 'test' }, { codes: ['KRW-BTC'], type: 'ticker' }]);
			expect(onError).not.toHaveBeenCalled();
			// 서버가 메시지를 보내고, 연결이 성공했는지 확인합니다.
			server.send(socketResponse);

			await waitFor(async () => {
				expect(result.current.isConnected).toBeTruthy();
			});

			expect(result.current.socket).not.toBeNull();
		});
	});
});

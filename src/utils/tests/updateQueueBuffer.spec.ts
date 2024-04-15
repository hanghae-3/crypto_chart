import { beforeEach, describe, expect, it } from 'vitest';
import { ITrade } from '../../types/crypto';
import generateTrade from './stub/generateTrade';
import updateQueueBuffer from '../updateQueueBuffer';

describe('updateQueueBuffer는', () => {
	let trades: ITrade[];
	beforeEach(() => {
		trades = [generateTrade('AAPL'), generateTrade('AAPL'), generateTrade('AAPL'), generateTrade('AAPL')];
	});
	it('버퍼의 최대 사이즈보다 아이템이 더 많은 경우, 앞쪽의 데이터를 제거를 한다.', () => {
		const maxSize = 3;
		const buffer: ITrade[] = trades;
		const expected: ITrade[] = trades.slice(1, 4);
		expect(updateQueueBuffer(buffer, maxSize)).toEqual(expected);
	});

	it('버퍼가 비어있으면 빈 배열을 반환한다.', () => {
		const maxSize = 3;
		const buffer: ITrade[] = [];
		const expected: ITrade[] = [];
		expect(updateQueueBuffer(buffer, maxSize)).toEqual(expected);
	});

	it('버퍼가 초과되지 않는다면, 데이터를 그대로 반환한다.', () => {
		const maxSize = 3;
		const buffer: ITrade[] = trades.slice(1, 3);
		const expected: ITrade[] = trades.slice(1, 3);
		expect(updateQueueBuffer(buffer, maxSize)).toEqual(expected);
	});
});

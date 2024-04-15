import { describe, expect, it } from 'vitest';
import isMarketCodes from '../isMarketCodes';
import { ImarketCodes } from '../../types/crypto';

describe('isMarketCodes는', () => {
	it('유효한 마켓 코드인 경우 true를 반환한다.', () => {
		const validMarketCode: ImarketCodes = {
			market: 'KRW-BTC',
			korean_name: '비트코인',
			english_name: 'Bitcoin',
		};

		expect(isMarketCodes(validMarketCode)).toBe(true);
	});

	it('유효하지 않은 마켓 코드인 경우 false를 반환한다.', () => {
		const invalidMarketCode = {
			market: 'KRW-BTC',
			korean_name: '비트코인',
			// Missing english_name property
		};

		expect(isMarketCodes(invalidMarketCode)).toBe(false);
	});

	it('객체가 아닌 경우 false를 반환한다.', () => {
		const nonObjectValues: unknown[] = ['string', 42, true, null, undefined];

		nonObjectValues.forEach((value) => {
			expect(isMarketCodes(value)).toBe(false);
		});
	});
});

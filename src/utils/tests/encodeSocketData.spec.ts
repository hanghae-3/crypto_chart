import { describe, expect, it } from 'vitest';
import encodeSocketData from '../encodeSocketData';

interface TestDataType {
	id: number;
	name: string;
}

describe('encodeSocketData는', () => {
	it('빈 ArrayBuffer를 해석한다면 디코딩 후에 undefined를 반환한다.', () => {
		const emptyDataBuffer = new ArrayBuffer(0);
		const result = encodeSocketData(emptyDataBuffer);
		expect(result).toBeUndefined();
	});
	it('JSON 데이터가 아닌 ArrayBuffer가 들어온다면 디코딩 후에 undefined를 반환한다.', () => {
		const invalidDataBuffer = new Uint8Array([1, 2, 3, 4]).buffer;
		const result = encodeSocketData(invalidDataBuffer);
		expect(result).toBeUndefined();
	});
	it('should decode a valid ArrayBuffer into the expected object', () => {
		const testData: TestDataType = { id: 1, name: 'test' };
		const testDataJson = JSON.stringify(testData);
		const testDataBuffer = new TextEncoder().encode(testDataJson).buffer;
		const result = encodeSocketData<TestDataType>(testDataBuffer);

		expect(result).toEqual(testData);
	});
});

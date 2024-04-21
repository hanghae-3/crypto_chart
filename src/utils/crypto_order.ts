import { IOrderbookUnit } from '../types/crypto';

export const getMaxSize = (orderbook: IOrderbookUnit[]) => {
	const askSizes: number[] = [];
	const bidSizes: number[] = [];
	orderbook.map((unit) => {
		askSizes.push(unit.ask_size);
		bidSizes.push(unit.bid_size);
	});
	const maxAskSize = Math.max(...askSizes);
	const maxBidSize = Math.max(...bidSizes);

	return [maxAskSize, maxBidSize];
};

export const getChangeType = (currentValue: number, prevClose: number) => {
	const change = currentValue - prevClose;
	if (change > 0) {
		return 'RISE';
	} else if (change === 0) {
		return 'EVEN';
	} else if (change < 0) {
		return 'FALL';
	} else {
		return 'EVEN';
	}
};

export const getChangeRate = (currentValue: number, prevClose: number) => {
	const result = Number((((currentValue - prevClose) / prevClose) * 100).toFixed(2));
	return result;
};

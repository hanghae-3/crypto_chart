import { ITicker, ImarketCodes } from '../types/crypto';

// ?
function sortBuffers(buffers: ITicker[], sortOrder: ImarketCodes[]) {
	if (buffers.length === 0 || sortOrder.length === 0) {
		return undefined;
	}

	const tickerMap: { [code: string]: ITicker } = {};
	buffers.forEach((ticker) => (tickerMap[ticker.code] = ticker));

	const result: ITicker[] = [];
	sortOrder.forEach(({ market }) => {
		const ticker = tickerMap[market];
		if (ticker) result.push(ticker);
	});

	return result;
}

export default sortBuffers;

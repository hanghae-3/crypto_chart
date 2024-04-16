import { ImarketCodes } from '../types/crypto';
import isMarketCodes from './isMarketCodes';

const isArrayOfMarketCodes = (obj: unknown): obj is ImarketCodes[] => {
	if (!Array.isArray(obj) || obj.length === 0) return false;

	return obj.every((item) => isMarketCodes(item));
};

export default isArrayOfMarketCodes;

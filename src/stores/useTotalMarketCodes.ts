import { create } from 'zustand';
import { ImarketCodes } from '../types/crypto';

const useTotalMarketCodes = create((set) => ({
	totalMarketCodes: [],
	setTotalMarketCodes: (totalMarketCodes: ImarketCodes[]) => set({ totalMarketCodes }),
}));
export default useTotalMarketCodes;

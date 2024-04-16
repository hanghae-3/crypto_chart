import { create } from 'zustand';
import { ImarketCodes } from '../types/crypto';

type State = {
	totalMarketCodes: ImarketCodes[];
	selectedCrypto: ImarketCodes[];
};

type Action = {
	setTotalMarketCodes: (totalMarketCodes: ImarketCodes[]) => void;
	setSelectedCrypto: (newCrypto: ImarketCodes) => void;
};

const useTotalMarketCodes = create<State & Action>((set) => ({
	totalMarketCodes: [],
	setTotalMarketCodes: (totalMarketCodes: ImarketCodes[]) => set({ totalMarketCodes }),
	selectedCrypto: [{ market: 'KRW-BTC', korean_name: '비트코인', english_name: 'Bitcoin' }],
	setSelectedCrypto: (newCrypto: ImarketCodes) => set((prev: ImarketCodes[]) => [...prev, newCrypto]),
}));
export default useTotalMarketCodes;

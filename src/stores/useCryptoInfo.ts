import { create } from 'zustand';
import { ITicker } from '../types/crypto';

type State = {
	selectedCryptoInfo: ITicker[];
};

type Action = {
	setSelectedCryptoInfo: (cryptoInfo: ITicker[]) => void;
};

const useCryptoInfo = create<State & Action>((set) => ({
	selectedCryptoInfo: [],
	setSelectedCryptoInfo: (selectedCryptoInfo: ITicker[]) => set({ selectedCryptoInfo }),
}));

export default useCryptoInfo;

import { create } from 'zustand';
import { CanSelectTime } from '../model/time';
type Action = {
	selectTime: (time: CanSelectTime) => void;
};
type State = {
	time: CanSelectTime;
};
const useTimeStore = create<State & Action>(
	(set) =>
		({
			// state
			time: '1Min',
			selectTime: (time) => set({ time }),
		}) as State & Action,
);

export default useTimeStore;

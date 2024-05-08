import { MouseEvent } from 'react';
import useTimeStore from '../../store/time.store';
import { CanSelectTime } from '../../model/time';

export default function TimeSelector() {
	const { selectTime, time } = useTimeStore();
	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		const { name } = e.currentTarget;
		selectTime(name as CanSelectTime);
	};

	return (
		<section>
			<button name="1Min" onClick={handleClick}>
				<div className={`${time === '1Min' ? 'text-blue-400' : 'text-gray-400'}`}>1분</div>
			</button>
			<button name="1Hour" onClick={handleClick}>
				<div className={`${time === '1Hour' ? 'text-blue-400' : 'text-gray-400'}`}>1시간</div>
			</button>
			<button name="1Day" onClick={handleClick}>
				<div className={`${time === '1Day' ? 'text-blue-400' : 'text-gray-400'}`}>1일</div>
			</button>
		</section>
	);
}

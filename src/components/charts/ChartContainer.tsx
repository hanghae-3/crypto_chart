// import { useState } from 'react';
import { useRef } from 'react';
import { useCheckDrag } from '../../hooks/crypto/useCheckDrag';
import { useStorePrices } from '../../hooks/crypto/useStorePrices';
import Chart from './Chart';

export default function ChartContainer() {
	// const [clickedX, setClickedX] = useState<number | null>(null);
	const ref = useRef<HTMLElement>(null);

	const { candles, fetchPrices } = useStorePrices({
		marketCode: 'KRW-BTC',
	});

	useCheckDrag(ref, () => {
		// TODO: Fetching Logic in here
		console.log('fetching중...');
		fetchPrices();
	});

	const candleList =
		candles.length > 0
			? candles.map((item) => ({
					// time: item.candle_date_time_kst.split('T')[0],
					// time: item.candle_date_time_utc,
					kortime: item.candle_date_time_kst,
					time: new Date(item.candle_date_time_kst).valueOf() / 1000,
					open: item.opening_price,
					high: item.high_price,
					low: item.low_price,
					close: item.trade_price,
				}))
			: [];
	console.log(candleList);

	return (
		<section
			style={{
				height: '30vh',
				width: '80vw',
				border: '3px solid black',
			}}
			ref={ref}
			// onMouseDown={(e) => {
			// 	setClickedX(e.clientX);
			// }}
			// onMouseMove={(e) => {
			// 	if (clickedX === null) return;
			// 	if (e.clientX - clickedX > 0) {
			// 		console.log('fetch Time');
			// 	}
			// }}
			// onMouseUp={() => {
			// 	setClickedX(null);
			// }}
		>
			<Chart candles={candleList} />
		</section>
	);
}

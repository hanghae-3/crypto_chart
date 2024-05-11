/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { UPBIT_CANDLE_REST_URL } from '../../constants/url';
import { differenceInMinutes, format, subMinutes } from 'date-fns';

type Props = {
	marketCode: string;
};
function formatDate(date: Date) {
	return format(date, 'yyyy-MM-dd') + 'T' + format(date, 'HH:mm:ss') + 'Z';
}
function getCurrentTime() {
	const date = new Date();
	// const dateString = date.toISOString().split('.')[0];
	const dateString = date.toISOString().split('.')[0];
	console.log(dateString);

	// return dateString + 'Z';
	// const dateStr = format(new Date(), 'yyyy-MM-dd') + 'T' + format(new Date(), 'HH:mm:ss') + 'Z';
	const dateStr = formatDate(new Date());
	// console.log(dateStr);
	return dateStr;
}

export const useStorePrices = ({ marketCode = 'KRW-BTC' }: Props) => {
	const [candles, setCandles] = useState<any[]>([]);
	const [lastTime, setLastTime] = useState<string>(getCurrentTime());

	console.log(lastTime);
	const fetchPrices = async () => {
		const url = UPBIT_CANDLE_REST_URL({
			marketCode,
			date: lastTime,
			count: 200,
			type: { time: 'minutes', sequence: 1 },
		});
		try {
			// console.log(url);
			const response = await fetch(url);
			const data = await response.json();
			const sortedData = data.sort(
				(a: any, b: any) => Number(new Date(a.candle_date_time_kst)) - Number(new Date(b.candle_date_time_kst)),
			);
			// console.log(sortedData, url);

			// return data;
			if (candles.length === 0) {
				// const lastTime = subMinutes(new Date(sortedData[0].candle_date_time_kst), 1).toISOString().split('.')[0] + 'Z';
				const lastTime = formatDate(subMinutes(new Date(sortedData[0].candle_date_time_kst), 1));

				// console.log(sortedData[0].candle_date_time_kst, lastTime);

				setCandles((prev) => {
					const newCandles = [...sortedData, ...prev];
					return [...new Set(newCandles.map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item));
				});
				setLastTime(lastTime);
			} else {
				// const maxTime = sortedData.at(-1).candle_date_time_kst;
				const maxTime = sortedData.at(-1).candle_date_time_kst + 'Z';
				const diff = differenceInMinutes(maxTime, lastTime);
				// console.log(diff, maxTime, lastTime);

				if (diff <= -1) {
					const date = sortedData[0].candle_date_time_kst;
					const lastTime = formatDate(subMinutes(new Date(sortedData[0].candle_date_time_kst), 1));
					// console.log('dff', sortedData, date, lastTime);
					// const lastTime =
					// 	subMinutes(new Date(sortedData[0].candle_date_time_kst), 1).toISOString().split('.')[0] + 'Z';
					// console.log('dff', sortedData, date, lastTime);

					setLastTime(lastTime);
					setCandles((prev) => {
						const newCandles = [...sortedData, ...prev];
						return [...new Set(newCandles.map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item));
					});
				}
				console.log('diff', maxTime, lastTime, differenceInMinutes(maxTime, lastTime));
				// const minTime = candles[0]?.candle_date_time_kst;
				// console.log(maxTime, minTime, candles);
			}

			// if() return;

			// setLastTime(lastTime);
			// setLastTime(sortedData[0].candle_date_time_kst);
		} catch (err) {
			console.error('fetchPrices error', err);
		}
	};

	const fetchPrevPeriodPrices = async () => {
		const url = UPBIT_CANDLE_REST_URL({
			marketCode,
			date: lastTime,
			count: 200,
			type: { time: 'minutes', sequence: 1 },
		});
		try {
			// console.log(url);
			const response = await fetch(url);
			const data = await response.json();
			const sortedData = data.sort(
				(a: any, b: any) => Number(new Date(a.candle_date_time_kst)) - Number(new Date(b.candle_date_time_kst)),
			);
			const lastTime = formatDate(subMinutes(new Date(sortedData[0].candle_date_time_kst), 1));
			setLastTime(lastTime);
			return sortedData;
		} catch (err) {}
	};

	useEffect(() => {
		setCandles([]);
		fetchPrices();
	}, [marketCode]);

	return {
		candles,
		fetchPrices,
		fetchPrevPeriodPrices,
	};
};

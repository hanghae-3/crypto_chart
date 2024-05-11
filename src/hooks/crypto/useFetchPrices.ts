/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { UPBIT_CANDLE_REST_URL } from '../../constants/url';

type Props = {
	marketCode: string;
	date: string;
};
export const useFetchPrices = ({ marketCode, date }: Props) => {
	const [prices, setPrices] = useState([]);

	const fetchPrices = async () => {
		const url = UPBIT_CANDLE_REST_URL({
			marketCode,
			date,
			count: 200,
			type: { time: 'minutes', sequence: 1 },
		});
		try {
			console.log(url);

			const response = await fetch(url);
			const data = await response.json();
			return data;
		} catch (err) {
			console.error('fetchPrices error', err);
		}
	};

	return { prices, fetchPrices };
};

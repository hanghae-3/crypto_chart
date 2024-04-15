import { useCallback, useEffect, useState } from 'react';
import { ImarketCodes } from '../../types/crypto';

function useFetchMarketCode(option = { debug: false }) {
	const REST_API_URL = 'https://api.upbit.com/v1/market/all?isDetails=false';

	const [isLoading, setIsLoading] = useState(true);
	const [marketCodes, setMarketCodes] = useState<ImarketCodes[]>([]);

	const fetchMarketCodes = useCallback(async () => {
		try {
			const response = await fetch(REST_API_URL);

			if (!response.ok) {
				throw new Error('Failed to fetch market codes');
			}

			const json = await response.text();
			const result = JSON.parse(json) as ImarketCodes[];
			setMarketCodes(result);
			if (option.debug) {
				console.log('Market codes fetched:', result);
			}
		} catch (error) {
			console.error('Error fetching market codes:', error);
		} finally {
			setIsLoading(false);
		}
	}, [option.debug]);

	useEffect(() => {
		fetchMarketCodes().catch((error) => {
			console.error('Error fetching market codes:', error);
		});
	}, [fetchMarketCodes]);

	return { isLoading, marketCodes };
}

export default useFetchMarketCode;

import { useEffect, useState } from 'react';
import { connectWebSocket, getMarketList } from '../../utils';
import { Coins, Marketcode } from '../../model/ticker';


const useWebsocket = ()  => {

	const [coins, setCoins] = useState<Coins>({});
	const [marketCodes, setMarketCodes] = useState<Marketcode[]>([]);

	useEffect(() => {
		const initWebSocket = async () => {
			const marketCodes = await getMarketList();
			setMarketCodes(marketCodes);
			const krwMarkets = marketCodes.filter((item) => item.market.includes('KRW')).map((item) => item.market);
			connectWebSocket(krwMarkets, (data) => {
				setCoins((prevCoins) => {
					const newCoins = { ...prevCoins };
					newCoins[data.code] = data;
					return newCoins;
				});
			});
		};
		initWebSocket();
	}, []);

	return [coins, marketCodes];
};

export default useWebsocket;

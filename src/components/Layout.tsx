import InfoBox from './InfoBox.tsx';
import ChartContainer from './ChartContainer.tsx';
import CoinList from './CoinList.tsx';
import { useEffect, useState } from 'react';
import { connectWebSocket, getMarketList } from '../utils.ts';
import { Coins, Marketcode } from '../model/ticker.ts';

const Layout = () => {
	const query = new URLSearchParams(window.location.search);
	const coinCode = query.get('code');
	const [coins, setCoins] = useState<Coins>({});
	const [marketCodes, setMarketCodes] = useState<Marketcode[]>([]);
	const currentCoin = coins[coinCode || 'KRW-BTC'];

	useEffect(() => {
		const init = async () => {
			const marketCodes = await getMarketList();
			setMarketCodes(marketCodes);
			const coins = marketCodes.filter((item) => item.market.includes('KRW')).map((item) => item.market);
			connectWebSocket(coins, (data) => {
				setCoins((prevCoins) => {
					const newCoins = { ...prevCoins }; // 기존 상태 복사
					newCoins[data.code] = data; // 새 데이터로 해당 코인 정보 업데이트
					return newCoins;
				});
			});
		};
		init();
	}, []);

	if (!coins) return;

	return (
		<div className="w-full p-[40px] bg-gray-100 h-full min-h-screen">
			<InfoBox currentCoin={currentCoin} marketCodes={marketCodes} />
			<ChartContainer currentCoin={currentCoin} coinCode={coinCode} />
			<CoinList coins={coins} marketCodes={marketCodes} />
		</div>
	);
};

export default Layout;

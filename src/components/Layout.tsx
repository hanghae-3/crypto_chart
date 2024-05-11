import InfoBox from './InfoBox.tsx';
import ChartContainer from './ChartContainer.tsx';
import CoinList from './CoinList.tsx';
import { useEffect, useState } from 'react';
import { getMarketList } from '../utils.ts';
import { Coins, Marketcode } from '../model/ticker.ts';
import WebSocketService from '../utils/websocket.ts';

const Layout = () => {
	const query = new URLSearchParams(window.location.search);
	const coinCode = query.get('code');
	const [coins, setCoins] = useState<Coins>({});
	const [marketCodes, setMarketCodes] = useState<Marketcode[]>([]);
	const currentCoin = coins[coinCode || 'KRW-BTC'];

	// useEffect(() => {
	// 	if (Object.keys(coins).length !== 0) return;
	// 	const init = async () => {
	// 		const marketCodes = await getMarketList();
	// 		setMarketCodes(marketCodes);
	// 		const coins = marketCodes.filter((item) => item.market.includes('KRW')).map((item) => item.market);
	// 		connectWebSocket(coins, (data) => {
	// 			setCoins((prevCoins) => {
	// 				const newCoins = { ...prevCoins };
	// 				newCoins[data.code] = data;
	// 				return newCoins;
	// 			});
	// 		});
	// 	};
	// 	init();
	// }, []);

	useEffect(() => {
		const wsService = WebSocketService.getInstance(); // 싱글톤 인스턴스 가져오기
		const init = async () => {
			const marketCodes = await getMarketList();
			setMarketCodes(marketCodes);
			const krwMarkets = marketCodes.filter((item) => item.market.includes('KRW')).map((item) => item.market);
			wsService.connect(krwMarkets, (data) => {
				setCoins((prevCoins) => {
					const newCoins = { ...prevCoins };
					newCoins[data.code] = data;
					return newCoins;
				});
			});
		};
		init();

		// 컴포넌트 언마운트 시 연결 해제
		return () => {
			wsService.disconnect();
		};
	}, []);

	if (!coins) return;

	return (
		<div className="w-full p-[40px] bg-gray-100 h-full min-h-screen">
			<InfoBox currentCoin={currentCoin} marketCodes={marketCodes} />
			<ChartContainer currentCoin={currentCoin} coinCode={coinCode} />
			<CoinList coins={coins} marketCodes={marketCodes} />
			{/* <InfoBox currentCoin={coins[coinCode || 'KRW-BTC']} marketCodes={marketCodes} /> */}
			{/* <ChartContainer /> */}
		</div>
	);
};

export default Layout;

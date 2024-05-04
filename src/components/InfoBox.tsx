import { Coins, Marketcode } from '../model/ticker.ts';

interface Props {
	coins: Coins;
	marketCodes: Marketcode[];
}

const InfoBox = ({ coins, marketCodes }: Props) => {
	const query = new URLSearchParams(window.location.search);
	const coinCode = query.get('code');
	const currentCoin = coins[coinCode || 'KRW-BTC'];
	const currentMarket = marketCodes.find((item) => item.market === coinCode);

	if (!coins || !currentCoin || !currentMarket) {
		return <div>loading...</div>;
	}

	return (
		<div className="w-full bg-white">
			<div className="h-[50px] border-b border-solid border-gray-300 flex items-center">
				{currentMarket?.korean_name}
			</div>
			<div className="flex p-[20px] items-center">
				<div className="flex-1 h-fulls">{currentCoin?.trade_price}</div>
				<div className="flex-1">
					<div className="flex gap-[20px]">
						<div className="flex-1">
							<div className="flex justify-between  border-b border-solid border-gray-300 py-[15px]">
								<div>고가</div>
								<div>{currentCoin?.high_price}</div>
							</div>
							<div className="flex justify-between py-[15px]">
								<div>저가</div>
								<div>{currentCoin?.low_price}</div>
							</div>
						</div>
						<div className="flex-1">
							<div className="flex justify-between  border-b border-solid border-gray-300 py-[15px]">
								<div>거래량(24h)</div>
								<div>{currentCoin?.acc_trade_volume_24h}</div>
							</div>
							<div className="flex justify-between py-[15px]">
								<div>거래대금(24H)</div>
								<div>{currentCoin?.acc_trade_price_24h}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InfoBox;

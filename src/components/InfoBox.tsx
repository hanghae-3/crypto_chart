import { Marketcode, Ticker } from '../model/ticker.ts';
import { formatNumber } from '../utils/format.ts';

interface Props {
	currentCoin: Ticker;
	marketCodes: Marketcode[];
}

const InfoBox = ({ currentCoin, marketCodes }: Props) => {
	const query = new URLSearchParams(window.location.search);
	const coinCode = query.get('code');
	const currentMarket = marketCodes.find((item) => item.market === coinCode);
	const [currency, coin] = coinCode?.split('-') || ['KRW', 'BTC'];

	if (!currentCoin || !currentMarket) {
		return <div>loading...</div>;
	}

	return (
		<div className="w-full bg-white">
			<div className="w-full h-[50px] p-[20px] border-b border-solid border-gray-300 flex items-center text-2xl ">
				{currentMarket?.korean_name}
			</div>
			<div className="flex p-[20px] items-center">
				<div className="flex-1 h-fulls">
					<div
						className={`text-3xl flex items-baseline gap-2 ${
							currentCoin.change === 'RISE' ? 'text-red-500' : 'text-blue-500'
						}`}>
						<div>{formatNumber(currentCoin?.trade_price)}</div> <div className="text-xl">{currency}</div>
					</div>
					<div className={`flex gap-[10px] ${currentCoin.change === 'RISE' ? 'text-red-500' : 'text-blue-500'}`}>
						<div>{(currentCoin.signed_change_rate * 100).toFixed(2)}%</div>
						<div>{formatNumber(currentCoin.signed_change_price)}</div>
					</div>
				</div>
				<div className="flex-1">
					<div className="flex gap-[20px]">
						<div className="flex-1">
							<div className="flex justify-between  border-b border-solid border-gray-300 py-[15px]">
								<div>고가</div>
								<div className="text-red-500">{formatNumber(currentCoin?.high_price)}</div>
							</div>
							<div className="flex justify-between py-[15px]">
								<div>저가</div>
								<div className="text-blue-500">{formatNumber(currentCoin?.low_price)}</div>
							</div>
						</div>
						<div className="flex-1">
							<div className="flex justify-between  border-b border-solid border-gray-300 py-[15px]">
								<div>거래량(24h)</div>
								<div>
									{formatNumber(+currentCoin?.acc_trade_volume_24h.toFixed(3))} {coin}
								</div>
							</div>
							<div className="flex justify-between py-[15px]">
								<div>거래대금(24H)</div>
								<div>
									{formatNumber(+currentCoin?.acc_trade_price_24h.toFixed(0))} {currency}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InfoBox;

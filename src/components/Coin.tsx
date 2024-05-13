import { useNavigate } from 'react-router-dom';
import { Marketcode, Ticker } from '../model/ticker.ts';
import { useEffect, useState } from 'react';
import { formatNumber } from '../utils/format.ts';
import { formatToMillion } from '../utils.ts';

interface Props {
	coin: [string, Ticker];
	marketCodes: Marketcode[];
}

const Coin = ({ coin, marketCodes }: Props) => {
	const navigate = useNavigate();
	const [prevPrice, setPrevPrice] = useState<number>(0);
	const [diffPrice, setDiffPrice] = useState<'even' | 'rise' | 'fall'>('even');

	const onFindMarket = (code: string) => {
		const market = marketCodes.find((item) => item.market === code);
		return market?.korean_name;
	};
	const [currency, coinName] = coin[0]?.split('-') || ['KRW', 'BTC'];

	useEffect(() => {
		if (prevPrice - coin[1].trade_price < 0) {
			setDiffPrice('rise');
		} else if (prevPrice - coin[1].trade_price > 0) {
			setDiffPrice('fall');
		}

		if (diffPrice !== 'even') {
			setTimeout(() => {
				setDiffPrice('even');
			}, 1000);
		}

		if (coin[1].trade_price !== prevPrice) {
			setPrevPrice(coin[1].trade_price);
		}
	}, [coin]);

	if (!coin[1]) return <></>;

	return (
		<div
			className="flex cursor-pointer justify-between p-[20px] border-b border-solid border-gray-300"
			onClick={() => navigate(`/exchanges?code=${coin[0]}`)}
			key={coin[1].code}>
			<div className="flex-1">
				<div>{onFindMarket(coin[1].code)}</div>
				<div>
					{currency}/{coinName}
				</div>
			</div>

			<div
				className={`flex justify-end flex-1 justify-between ${
					coin[1].change === 'RISE' ? 'text-red-500' : 'text-blue-500'
				} ${
					diffPrice === 'rise'
						? 'border border-solid border-red-500'
						: diffPrice === 'fall'
							? 'border border-solid border-blue-500'
							: 'border-none'
				}`}>
				{formatNumber(coin[1].trade_price)}
			</div>
			<div className={`${coin[1].change === 'RISE' ? 'text-red-500' : 'text-blue-500'} flex-1 text-center`}>
				<div>{(coin[1].signed_change_rate * 100).toFixed(2)}%</div>
				<div>{formatNumber(coin[1].signed_change_price)}</div>
			</div>
			<div className="flex-1 text-center">
				{formatToMillion(coin[1].acc_trade_price_24h)}
				<span className="text-gray-400">백만</span>
			</div>
		</div>
	);
};

export default Coin;

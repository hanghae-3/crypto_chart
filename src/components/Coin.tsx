import { useNavigate } from 'react-router-dom';
import { Marketcode, Ticker } from '../model/ticker.ts';
import { useEffect, useState } from 'react';

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

	useEffect(() => {
		// 새로운 코인 데이터가 수신될 때마다 이전 가격을 업데이트
		if (prevPrice - coin[1].trade_price) {
			if (prevPrice - coin[1].trade_price > 0) {
				setDiffPrice('rise');
			} else if (prevPrice - coin[1].trade_price === 0) {
				setDiffPrice('even');
			} else {
				setDiffPrice('fall');
			}
		}
		if (coin[1].trade_price !== prevPrice) {
			setPrevPrice(coin[1].trade_price);
		}
	}, [coin]);

	return (
		<div
			className="flex justify-between bg-white p-[20px] border-b border-solid border-gray-300"
			onClick={() => navigate(`/exchanges?code=${coin[0]}`)}
			key={coin[1].code}>
			<div>{onFindMarket(coin[1].code)}</div>
			<div
				className={
					diffPrice === 'rise'
						? 'border border-solid border-red-500'
						: diffPrice === 'fall'
							? 'border border-solid border-blue-500'
							: 'border-none'
				}>
				{coin[1].trade_price}
			</div>
			<div>{coin[1].signed_change_price}</div>
			<div>{coin[1].timestamp}</div>
		</div>
	);
};

export default Coin;

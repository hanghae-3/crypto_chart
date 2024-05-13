import { Coins, Marketcode } from '../model/ticker.ts';
import Coin from './Coin.tsx';

interface Props {
	coins: Coins;
	marketCodes: Marketcode[];
}

const CoinList = ({ coins, marketCodes }: Props) => {
	if (!coins) return <></>;

	return (
		<div className="bg-white p-[20px]">
			<div className="border-b border-solid border-gray-500 flex justify-between p-[20px] text-lg">
				<div className="flex-1">이름</div>
				<div className="flex-1">현재가</div>
				<div className="flex-1 text-center">전일대비</div>
				<div className="flex-1 text-center">거래대금</div>
			</div>
			{Object.entries(coins).map((coin) => {
				return <Coin key={coin[0]} coin={coin} marketCodes={marketCodes} />;
			})}
		</div>
	);
};

export default CoinList;

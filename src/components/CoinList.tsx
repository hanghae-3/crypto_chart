import { Coins, Marketcode } from '../model/ticker.ts';
import Coin from './Coin.tsx';

interface Props {
	coins: Coins;
	marketCodes: Marketcode[];
}

const CoinList = ({ coins, marketCodes }: Props) => {
	if (!coins) return <></>;

	return (
		<div>
			{Object.entries(coins).map((coin) => {
				return <Coin key={coin[0]} coin={coin} marketCodes={marketCodes} />;
			})}
		</div>
	);
};

export default CoinList;

import { Ticker } from '../model/ticker';
import Charts from './charts-test/Charts';

type Props = {
	currentCoin: Ticker;
	coinCode: string;
};
const ChartContainer = ({ currentCoin, coinCode }: Props) => {
	// console.log(currentCoin.market);
	// console.log(currentCoin);

	return (
		<div className="h-full">
			<Charts currentCoin={currentCoin} coinCode={coinCode} />
		</div>
	);
};

export default ChartContainer;

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Ticker } from '../model/ticker';
import CryptoChart from './chart/CryptoChart';
import useTimeStore from '../store/time.store';

type Props = {
	currentCoin: Ticker;
	coinCode: string;
};
const ChartContainer = ({ currentCoin, coinCode }: Props) => {
	const { time } = useTimeStore();
	return (
		<div className="h-full">
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<CryptoChart currentCoin={currentCoin} coinCode={coinCode} time={time} />
			</ErrorBoundary>
		</div>
	);
};

export default ChartContainer;

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
	return (
		<div className="flex flex-col items-center justify-center px-3 pt-52">
			{/* <h1 className="text-center">{error.message}</h1> */}
			<p className="mt-4 ">데이터를 불러오는 중에 문제가 발생했습니다.</p>
			<button className="border-black rounded-sm border-[2px] px-2 py-1" onClick={() => resetErrorBoundary()}>
				reset
			</button>
		</div>
	);
};

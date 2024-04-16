import { useEffect, useRef } from 'react';
import './App.css';
// import Chart from './components/Chart';
// import { useClientWidthHeight } from './hooks/useClientWidthHeight';
import CryptoSelector from './components/CryptoSelector';
import useFetchMarketCode from './hooks/crypto/useFetchMarketCode';
import useTotalMarketCodes from './stores/useTotalMarketCodes';

function App() {
	const mainRef = useRef<HTMLElement>(null);
	// const { width, height } = useClientWidthHeight(mainRef);
	const { isLoading, marketCodes } = useFetchMarketCode();
	const { setTotalMarketCodes } = useTotalMarketCodes();

	useEffect(() => {
		const marketCodes_KRW = marketCodes.filter((code) => code.market.includes('KRW'));
		setTotalMarketCodes(marketCodes_KRW);
	}, [marketCodes]);

	return (
		<main className="w-[100vw] h-[100vh]" ref={mainRef}>
			{/* <Chart width={width} height={height} /> */}
			<CryptoSelector />
		</main>
	);
}

export default App;

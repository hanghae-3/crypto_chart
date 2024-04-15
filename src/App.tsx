import { useRef } from 'react';
import './App.css';
// import Chart from './components/Chart';
// import { useClientWidthHeight } from './hooks/useClientWidthHeight';
import Page from './components/Page';

function App() {
	const mainRef = useRef<HTMLElement>(null);
	// const { width, height } = useClientWidthHeight(mainRef);

	return (
		<main className="w-[100vw] h-[100vh]" ref={mainRef}>
			{/* <Chart width={width} height={height} /> */}
			<Page />
		</main>
	);
}

export default App;

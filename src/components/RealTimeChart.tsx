import { useEffect, useRef, useState } from 'react';
import useCryptoInfo from '../stores/useCryptoInfo';
import useTotalMarketCodes from '../stores/useTotalMarketCodes';
import getTodayDate from '../utils/getTodayDate';
import { ITicker } from '../types/crypto';
import { CrosshairMode, createChart } from 'lightweight-charts';

type ProcessedData = {
	time: string;
	open: number;
	high: number;
	low: number;
	close: number;
};

type UpdatedData = ProcessedData;

export default function RealTimeChart() {
	const { selectedCrypto } = useTotalMarketCodes();
	const { selectedCryptoInfo } = useCryptoInfo();

	const [fetchedData, setFetchedData] = useState<(ITicker & { candle_date_time_kst: string })[]>();
	const [processedData, setProcessedData] = useState<ProcessedData[]>();
	const [updatedCandle, setUpdatedCandle] = useState<UpdatedData[]>();
	const options = { method: 'GET', headers: { Accept: 'application/json' } };

	useEffect(() => {
		async function fetchDayCandle(marketCode: string, date: string, count: number) {
			try {
				const response = await fetch(
					`https://api.upbit.com/v1/candles/days?market=${marketCode}&to=${date}T09:00:00Z&count=${count}&convertingPriceUnit=KRW`,
					options,
				);
				const result = await response.json();
				setFetchedData(result);
			} catch (error) {
				console.error(error);
			}
		}
		if (selectedCrypto) {
			fetchDayCandle(selectedCrypto[0].market, getTodayDate(), 200);
		}
	}, [selectedCrypto]);

	useEffect(() => {
		if (fetchedData) {
			const processed = [...fetchedData].reverse().map((data) => {
				return {
					time: data.candle_date_time_kst.split('T')[0],
					open: data.opening_price,
					high: data.high_price,
					low: data.low_price,
					close: data.trade_price,
				};
			});
			setProcessedData(processed);
		}
	}, [fetchedData]);

	useEffect(() => {
		if (selectedCryptoInfo[0]) {
			setUpdatedCandle({
				time: selectedCryptoInfo[0].trade_date
					? {
							day: selectedCryptoInfo[0].trade_date.slice(6, 8),
							month: selectedCryptoInfo[0].trade_date.slice(4, 6),
							year: selectedCryptoInfo[0].trade_date.slice(0, 4),
						}
					: null,
				open: selectedCryptoInfo[0].opening_price,
				high: selectedCryptoInfo[0].high_price,
				low: selectedCryptoInfo[0].low_price,
				close: selectedCryptoInfo[0].trade_price,
			});
		}
	}, [selectedCryptoInfo]);

	return <ChartContainer processedData={processedData} updatedCandle={updatedCandle} />;
}
type Props = { processedData: ProcessedData[] | undefined; updatedCandle: UpdatedData[] | undefined };

function ChartContainer({ processedData, updatedCandle }: Props) {
	const backgroundColor = 'white';
	const textColor = 'black';
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chart = useRef<any>();
	const newSeries = useRef<any>();

	useEffect(() => {
		console.log(1, processedData);
		if (processedData && chartContainerRef.current) {
			console.log(2, processedData);
			const handleResize = () => {
				chart.current.applyOptions({
					width: chartContainerRef.current?.clientWidth,
				});
			};
			chart.current = createChart(chartContainerRef.current, {
				layout: {
					backgroundColor,
					textColor,
				},
				width: chartContainerRef.current.clientWidth,
				height: 300,
				crosshair: {
					mode: CrosshairMode.Normal,
				},
				leftPriceScale: {
					borderVisible: false,
				},
				rightPriceScale: {
					borderVisible: false,
					scaleMargins: {
						top: 0.1,
						bottom: 0.1,
					},
				},
				timeScale: {
					borderVisible: false,
				},
			});
			chart.current.timeScale().fitContent();
			newSeries.current = chart.current.addCandlestickSeries({
				upColor: '#D24F45',
				wickUpColor: '#D24F45',
				downColor: '#1261C4',
				wickDownColor: '#1261C4',
				borderVisible: false,
			});
			window.addEventListener('resize', handleResize);
			console.log(processedData);

			newSeries.current.setData(processedData);

			return () => {
				window.removeEventListener('resize', handleResize);
				chart.current.remove();
			};
		}
	}, [processedData]);

	useEffect(() => {
		if (updatedCandle && newSeries.current) {
			newSeries.current?.update(updatedCandle);
		}
	}, [updatedCandle]);

	return (
		<section className="col-span-2 w-[100%] h-[300px] bg-white">
			<div className="border-[1px] border-white border-solid" ref={chartContainerRef}></div>
		</section>
	);
}

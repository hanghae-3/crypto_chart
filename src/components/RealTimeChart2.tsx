import { useEffect, useRef, useState } from 'react';
import useCryptoInfo from '../stores/useCryptoInfo';
import useTotalMarketCodes from '../stores/useTotalMarketCodes';
import getTodayDate from '../utils/getTodayDate';
import { ITicker } from '../types/crypto';
import { CrosshairMode, LineStyle, createChart } from 'lightweight-charts';
import { useGetPrice } from '../hooks/crypto/useGetPrice';
import { format } from 'date-fns';

type ProcessedData = {
	time: string;
	open: number;
	high: number;
	low: number;
	close: number;
};

type UpdatedData = ProcessedData;

export default function RealTimeChart2() {
	const { selectedCrypto } = useTotalMarketCodes();
	const { selectedCryptoInfo } = useCryptoInfo();

	const [processedData, setProcessedData] = useState<ProcessedData[]>();
	const [updatedCandle, setUpdatedCandle] = useState<UpdatedData[]>();
	const { socketData } = useGetPrice(selectedCrypto[0]);

	useEffect(() => {
		// console.log(socketData?.map((data) => data.timestamp));
		// console.log(socketData && format(new Date(socketData[0].timestamp), 'yyyy-MM-dd'));

		// console.log(fetchedData);

		console.log(socketData);
		if (socketData) {
			const processed = [...socketData].map((data) => {
				console.log(format(new Date(data.timestamp), 'yyyy-MM-dd hh:mm:ss'));
				return {
					// time: data.timestamp.toString(),
					// time: format(new Date(data.timestamp), 'yyyy-MM-dd'),
					// time: Date.parse(format(new Date(data.timestamp), 'yyyy-MM-dd hh:mm')) / 1000,
					// time: data.timestamp.toString(),
					time: data.timestamp,
					open: data.opening_price,
					high: data.high_price,
					low: data.low_price,
					close: data.trade_price,
				};
			});
			console.log(processed);

			setProcessedData(processed);
			setUpdatedCandle(processed?.at(-1));
		}
		// }, [fetchedData]);
	}, [socketData]);

	// useEffect(() => {
	// 	if (selectedCryptoInfo[0]) {
	// 		setUpdatedCandle({
	// 			// time: selectedCryptoInfo[0].trade_date
	// 			// 	? {
	// 			// 			day: Number(selectedCryptoInfo[0].trade_date.slice(6, 8)),
	// 			// 			month: Number(selectedCryptoInfo[0].trade_date.slice(4, 6)),
	// 			// 			year: Number(selectedCryptoInfo[0].trade_date.slice(0, 4)),
	// 			// 		}
	// 			// 	: null,
	// 			time: selectedCryptoInfo[0].timestamp,
	// 			open: selectedCryptoInfo[0].opening_price,
	// 			high: selectedCryptoInfo[0].high_price,
	// 			low: selectedCryptoInfo[0].low_price,
	// 			close: selectedCryptoInfo[0].trade_price,
	// 		});
	// 	}
	// }, [selectedCryptoInfo]);

	return <ChartContainer processedData={processedData} updatedCandle={updatedCandle} />;
}
type Props = { processedData: ProcessedData[] | undefined; updatedCandle: UpdatedData[] | undefined };

function ChartContainer({ processedData, updatedCandle }: Props) {
	const backgroundColor = 'white';
	const textColor = 'black';
	const toolTipMargin = 15;
	const toolTipWidth = 80;
	const toolTipHeight = 80;
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chart = useRef<any>();
	const newSeries = useRef<any>();
	const toolTipRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// console.log(1, processedData);
		if (processedData && chartContainerRef.current) {
			// console.log(2, processedData);
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
				overlayPriceScales: {},
				localization: {
					dateFormat: 'yyyy-MM-dd HH:mm:ss',
				},
			});
			chart.current.timeScale().fitContent();
			// chart.current.addCandlestickSeries();
			newSeries.current = chart.current.addCandlestickSeries({
				upColor: '#D24F45',
				wickUpColor: '#D24F45',
				downColor: '#1261C4',
				wickDownColor: '#1261C4',
				borderVisible: false,
			});

			chart.current.applyOptions({
				crosshair: {
					// Change mode from default 'magnet' to 'normal'.
					// Allows the crosshair to move freely without snapping to datapoints
					mode: CrosshairMode.Normal,

					// Vertical crosshair line (showing Date in Label)
					vertLine: {
						width: 8,
						color: '#C3BCDB44',
						style: LineStyle.Solid,
						labelBackgroundColor: '#9B7DFF',
					},

					// Horizontal crosshair line (showing Price in Label)
					horzLine: {
						color: '#9B7DFF',
						labelBackgroundColor: '#9B7DFF',
					},
				},
			});

			// const series = chart.current.addAreaSeries({
			// 	topColor: 'rgba( 239, 83, 80, 0.05)',
			// 	bottomColor: 'rgba( 239, 83, 80, 0.28)',
			// 	lineColor: 'rgba( 239, 83, 80, 1)',
			// 	lineWidth: 2,
			// 	crossHairMarkerVisible: false,
			// 	priceLineVisible: false,
			// 	lastValueVisible: false,
			// });

			console.log(processedData, updatedCandle);

			chart.current.subscribeCrosshairMove((param: any) => {
				if (!chartContainerRef.current) return;
				if (!toolTipRef.current) return;
				if (
					param.point === undefined ||
					!param.time ||
					param.point.x < 0 ||
					param.point.x > chartContainerRef.current.clientWidth ||
					param.point.y < 0 ||
					param.point.y > chartContainerRef.current.clientHeight
				) {
					toolTipRef.current!.style.display = 'none';
				} else {
					const dateStr = param.time;
					toolTipRef.current.style.display = 'block';

					const data = param.seriesData.get(newSeries.current);
					const price = data.value !== undefined ? data.value : data.close;
					toolTipRef.current.innerHTML = `
					<div class="mt-1 font-bold text-center">${(Math.round(100 * price) / 100).toLocaleString('ko-KR')}</div>
					<div class="text-center">${dateStr}</div>`;

					let left = param.point.x;
					const timeScaleWidth = chart.current.timeScale().width();
					const priceScaleWidth = chart.current.priceScale('left').width();
					const halfTooltipWidth = toolTipWidth / 2;
					left += priceScaleWidth - halfTooltipWidth;
					left = Math.min(left, priceScaleWidth + timeScaleWidth - toolTipWidth);
					left = Math.max(left, priceScaleWidth);

					toolTipRef.current.style.left = left + 'px';
					toolTipRef.current.style.top = 0 + 'px';
				}
			});
			window.addEventListener('resize', handleResize);
			// console.log(processedData);

			newSeries.current.setData(processedData);
			// newSeries.current.setData(updatedCandle);

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
			<div className="border-[1px] border-white border-solid relative" ref={chartContainerRef}>
				<div
					// className="w-[96px] h-[80]x absolute hidden bg-white text-black border-[#2962FF] border-[1px] border-solid z-[10]"
					className={`w-[96px] h-[300px] absolute hidden p-2 box-border text-[12px] text-left z-[1000] top-[12px] left-[12px] pointer-events-none rounded-t-[4px] border-solid border-cryptoTooltip bg-cryptoTooltipBg border-b-0 shadow-tooltipCard`}
					ref={toolTipRef}></div>
			</div>
		</section>
	);
}
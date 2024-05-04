import { CrosshairMode, LineStyle, createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

type Props = {
	candles: any;
	updatedCandle?: any;
};
export default function Chart({ candles }: Props) {
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
		// console.log(1, candles);
		if (candles && chartContainerRef.current) {
			// console.log(2, candles);
			const handleResize = () => {
				chart.current.applyOptions({
					width: chartContainerRef.current?.clientWidth,
				});
			};
			chart.current = createChart(chartContainerRef.current, {
				layout: {
					// background: backgroundColor,
					backgroundColor,
					textColor,
				},
				width: chartContainerRef.current.clientWidth,
				height: 300,
				localization: {
					locale: 'ko-KR',
					dateFormat: 'yyyy-MM-dd',
				},
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
					timeVisible: true,
					secondsVisible: true,
				},
				overlayPriceScales: {},
				// kineticScroll: {
				// 	// mouse: true,
				// },
			});
			chart.current.timeScale().fitContent();
			chart.current.subscribeClick((params) => {
				console.log(params);
			});
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

					// console.log(data);

					// const y = param.point.y;
					// let left = param.point.x + toolTipMargin;
					// if (left > chartContainerRef.current.clientWidth - toolTipWidth) {
					// 	left = param.point.x - toolTipMargin - toolTipWidth;
					// }

					// let top = y + toolTipMargin;
					// if (top > chartContainerRef.current.clientHeight - toolTipHeight) {
					// 	top = y - toolTipHeight - toolTipMargin;
					// }
					// toolTipRef.current.style.left = left + 'px';
					// toolTipRef.current.style.top = top + 'px';

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
			console.log(candles);

			newSeries.current.setData(candles);

			return () => {
				window.removeEventListener('resize', handleResize);
				chart.current.remove();
			};
		}
	}, [candles]);

	// useEffect(() => {
	// 	if (updatedCandle && newSeries.current) {
	// 		console.log(updatedCandle);

	// 		newSeries.current?.update(updatedCandle);
	// 	}
	// }, [updatedCandle]);

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

import {
	type ISeriesApi,
	type LogicalRange,
	type ITimeScaleApi,
	type IChartApi,
	type MouseEventParams,
} from 'lightweight-charts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DataFeed } from '../../services/DataFeed';
import { CandlestickSeries, Chart, TimeScale } from 'lightweight-charts-react-wrapper';
import { debounce } from 'lodash';
import { convertTimeToLocal, formatDate, getCurrentTime } from '../../utils/date/date';
import { differenceInMinutes, subMinutes } from 'date-fns';

import { Ticker } from '../../model/ticker';

// https://codesandbox.io/p/sandbox/lightweight-charts-react-wrapper-infinite-history-hdymls?file=%2Fexample.tsx
// https://tradingview.github.io/lightweight-charts/tutorials/demos/infinite-history

const width = 1000;
const height = 600;
type Props = {
	currentCoin: Ticker;
	coinCode: string;
};
function Charts({ coinCode, currentCoin }: Props) {
	const chartRef = useRef<IChartApi>(null);
	const timeScale = useRef<ITimeScaleApi<any>>(null);
	const candleSeries = useRef<ISeriesApi<'Candlestick'>>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const [data, setData] = useState<any[]>([]);
	const dataFeed = useRef<any>(new DataFeed(coinCode));

	useEffect(() => {
		async function initializeData() {
			const candles = await dataFeed.current.getBars();
			setData(candles);
		}

		initializeData();
	}, []);

	useEffect(() => {
		let isFetching = false;
		let currentBar: any = {
			open: null,
			high: null,
			low: null,
			close: null,
			time: getCurrentTime(),
		};
		const intervalId = setInterval(async () => {
			// dataFeed.current.getCurrentPrice();
			// setData(dataFeed.current.data);
			if (isFetching) return;

			const currentTime = formatDate(subMinutes(new Date(), 1)); // 현재 시간
			const latestTime = dataFeed.current.latestTime; // 가장 최근 시간
			// console.log(currentTime, latestTime, differenceInMinutes(currentTime, latestTime));
			// console.log(currentTime);

			// console.log(currentTime, latestTime);
			console.log('start');
			if (differenceInMinutes(currentTime, latestTime) >= 1) {
				// dataFeed.current.latestTime = currentTime;
				isFetching = true;
				const candles = await dataFeed.current.getCurrentPrice(currentTime);
				console.log('update minute', candleSeries, currentTime, latestTime);
				if (candles) {
					// console.log(candles);x
					setData(candles);
					currentBar = {
						open: null,
						high: null,
						low: null,
						close: null,
						time: convertTimeToLocal(new Date(getCurrentTime())),
					};
				}
				isFetching = false;
			} else if (!isFetching) {
				console.log('Realtime', formatDate(new Date(currentCoin.timestamp)));
				// console.log(dataFeed.current.data);

				const lastPrice = dataFeed.current?.data.at(-1).close;
				// const response = await fetch(`https://api.upbit.com/v1/ticker?markets=KRW-BTC`);
				// const data = await response.json();
				// console.log(data);

				currentBar = {
					// time: convertTimeToLocal(formatDate(new Date(data[0].timestamp))),
					// time: convertTimeToLocal(formatDate(new Date(data[0].timestamp))),
					time: new Date(formatDate(new Date(currentCoin.timestamp))).valueOf() / 1000,
					// open: lastPrice,
					open: lastPrice,
					high: Math.max(currentCoin.trade_price, currentBar.high || 0),
					low: Math.min(currentCoin.trade_price, currentBar.low || Infinity),
					close: currentCoin.trade_price,
					// kortime: currentCoin.candle_date_time_kst,
				};
				candleSeries.current?.update(currentBar);
			}
			isFetching = false;
			// console.log(data);
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [coinCode, data, currentCoin]);

	useEffect(() => {
		if (!coinCode) return;
		dataFeed.current.setMarketCode(coinCode);
		async function initializeData() {
			const candles = await dataFeed.current.getBars();
			setData(candles);
		}

		initializeData();
	}, [coinCode]);

	/**
	 * @description - 좌우 스크롤 시 데이터를 추가해주는 것
	 */
	const handleVisibleLogicalRangeChange = useCallback(
		debounce(async (logicalRange: LogicalRange) => {
			if (logicalRange.from < 10) {
				console.log('fetch', logicalRange.from < 10);
				const barsInfo = await dataFeed.current.getBars();
				if (barsInfo !== null) {
					setData(barsInfo);
				}
			}
		}, 400),
		[],
	);

	const handleCrosshairMove = (params: MouseEventParams) => {
		if (!chartRef.current || !tooltipRef.current) return;
		tooltipRef.current.innerHTML = '';
		tooltipRef.current.style.display = 'none';
		if (!params.point || !params.time) return;

		const isMouseOutsideHorizontal = params.point.x < 0 || params.point.x > width;
		const isMouseOutsideVertical = params.point.y < 0 || params.point.y > height;
		if (isMouseOutsideHorizontal || isMouseOutsideVertical) {
			tooltipRef.current.innerHTML = '';
			tooltipRef.current.style.display = 'none';
		} else {
			const date = params.time;
			const data = params.seriesData.get(candleSeries.current as any) as any;
			const price = data && data.value !== undefined ? data.value : data.close;

			tooltipRef.current.style.display = 'block';
			tooltipRef.current.innerHTML = `
					<div class="mt-1 font-bold text-center">${(Math.round(100 * price) / 100).toLocaleString('ko-KR')}</div>
					<div class="text-center"></div>`;
		}
		// `<div class="mt-1 font-bold text-center">${(Math.round(100 * price) / 100).toLocaleString('ko-KR')}</div>
		// 			<div class="text-center">${dateStr}</div>`;
	};

	return (
		<div className="w-[30vw]">
			<div className="container relative">
				<Chart width={width} height={height} ref={chartRef} onCrosshairMove={handleCrosshairMove}>
					<TimeScale ref={timeScale} onVisibleLogicalRangeChange={handleVisibleLogicalRangeChange} timeVisible />
					<CandlestickSeries ref={candleSeries} data={data} reactive={true} />
					<div className="absolute z-10 top-2" ref={tooltipRef}></div>
				</Chart>
			</div>
		</div>
	);
}
export default Charts;

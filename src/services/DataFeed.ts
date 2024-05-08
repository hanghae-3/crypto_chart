import { differenceInMinutes, subMinutes } from 'date-fns';
import { convertTimeToLocal, formatDate, getCurrentTime } from '../utils/date/date';
import { Times, UPBIT_CANDLE_REST_URL } from '../constants/url';
import { isEqual } from 'lodash';

//https://github.com/tradingview/lightweight-charts/blob/7104e9a4fb399f18db7a2868a91b3246014c4324/docs/time-zones.md

export class DataFeed {
	private marketCode: string = 'KRW-BTC';
	data: any[];
	earliestTime: string; // 가져온 시간 중 가장 오래된 시간
	latestTime: string; // 가장 최근 시간
	type: Times = {
		time: 'minutes',
		sequence: 1,
	};
	// sequence: 1 | 3 | 5 | 15 | 30 | 60 = 1; // 1분봉
	count: number = 200; // 200개

	constructor(marketCode: string) {
		const date = new Date();
		this.data = [];
		this.earliestTime = getCurrentTime();
		// this.earliestTime = formatDate(subMinutes(new Date(date), 1));
		// this.latestTime = formatDate(subMinutes(new Date(date), 1));
		this.latestTime = formatDate(subMinutes(new Date(date), 1));
		// this.marketCode = 'KRW-BTC';
		this.marketCode = marketCode;
	}

	setType(type: Times) {
		if (isEqual(this.type, type)) {
			console.log('same');
			return;
		} else {
			this.type = type;
			this.data = [];
		}
	}
	/**
	 * @description set market code and initialize data when market code is changed
	 */
	setMarketCode(marketCode: string) {
		if (this.marketCode === marketCode) return;
		// 마켓코드가 변경된 경우, 마켓코드를 변경하고 데이터를 초기화
		this.marketCode = marketCode;
		this.data = [];
		this.earliestTime = getCurrentTime();
	}

	/**
	 * @description fetch all prices that we had fetched before
	 */
	async getBars() {
		// 정렬된 데이터를 가져옴
		const prevData = await this.fetchPrevPeriodPrices();
		if (prevData.length === 0) return;

		// 데이터를 변환하는 작업을 진행
		const candles = prevData.map((item) => {
			return {
				kortime: item.candle_date_time_kst,
				// time: new Date(item.candle_date_time_kst).valueOf() / 1000,
				time: convertTimeToLocal(item.candle_date_time_kst),
				open: item.opening_price,
				high: item.high_price,
				low: item.low_price,
				close: item.trade_price,
			};
		});

		// fetch된 데이터 중 가장 최근 데이터의 시간을 가져온 후, 시간 차이를 계산
		const maxTime = prevData.at(-1).candle_date_time_kst + 'Z';
		const diff = differenceInMinutes(maxTime, this.earliestTime);

		// 최초로 fetch된 데이터인지에 따라 데이터를 추가하는 과정이 다름
		if (this.data.length > 0) {
			// 최초로 fetch된 데이터가 아닌 경우
			if (diff <= 0) {
				// 올바른 데이터를 fetch한 경우
				this.data = [...candles, ...this.data];
				this.earliestTime = formatDate(subMinutes(new Date(prevData[0].candle_date_time_kst), 1));
			}
		} else {
			this.data = [...candles];
		}

		// console.log(this.data[0].kortime);
		// console.log(this.earliestTime);

		// 중복 제거
		this.data = [...new Set(this.data.map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item));
		return this.data;
	}

	async getCurrentPrice(time: string) {
		// const time = addMinutes(new Date(this.data.at(-1).kortime), 1);

		const url = UPBIT_CANDLE_REST_URL({
			marketCode: this.marketCode,
			date: time,
			count: 1,
			type: this.type,
		});
		// console.log(url);

		try {
			const response = await fetch(url);
			const data = await response.json();
			const diff = differenceInMinutes(data[0].candle_date_time_kst, this.data.at(-1).kortime);

			// if (diff <= 0) return;
			if (diff < 0) return;
			if (data.length === 0) return;

			this.data.push({
				time: convertTimeToLocal(data[0].candle_date_time_kst),
				open: data[0].opening_price,
				high: data[0].high_price,
				low: data[0].low_price,
				close: data[0].trade_price,
				kortime: data[0].candle_date_time_kst,
			});
			// this.latestTime = formatDate(new Date(time));
			this.latestTime = time;
		} catch (err) {
			console.log(err);
		}
		return this.data;
	}

	/**
	 * @description fetch previous period prices
	 */
	private async fetchPrevPeriodPrices() {
		const url = UPBIT_CANDLE_REST_URL({
			marketCode: this.marketCode,
			date: this.earliestTime,
			count: this.count,
			// type: { time: 'minutes', sequence: this.sequence },
			type: this.type,
		});

		try {
			// console.log(url);
			const response = await fetch(url);
			const data = await response.json();
			const sortedData = data.sort(
				(a: any, b: any) => new Date(a.candle_date_time_kst) - new Date(b.candle_date_time_kst),
			);
			// this.earliestTime = formatDate(subMinutes(new Date(sortedData[0].candle_date_time_kst), 1));

			return sortedData;
		} catch (err) {}
	}
}

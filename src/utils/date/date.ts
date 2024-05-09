import { format } from 'date-fns';

export function formatDate(date: Date, until: 'minute' | 'hour' | 'day' = 'minute') {
	// return format(date, 'yyyy-MM-dd') + 'T' + format(date, 'HH:mm:ss') + 'Z';
	if (until === 'minute') return format(date, 'yyyy-MM-dd') + 'T' + format(date, 'HH:mm') + ':00Z';
	else if (until === 'hour') return format(date, 'yyyy-MM-dd') + 'T' + format(date, 'HH') + ':00:00Z';
	else return format(date, 'yyyy-MM-dd') + 'T09:00:00Z';
}
export function getCurrentTime() {
	const dateStr = formatDate(new Date());
	return dateStr;
}

export function convertTimeToLocal(time: number | Date | string) {
	const date = new Date(time);

	return (
		Date.UTC(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds(),
		) / 1000
	);
}

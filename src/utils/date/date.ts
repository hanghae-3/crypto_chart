import { format } from 'date-fns';

export function formatDate(date: Date) {
	// return format(date, 'yyyy-MM-dd') + 'T' + format(date, 'HH:mm:ss') + 'Z';
	return format(date, 'yyyy-MM-dd') + 'T' + format(date, 'HH:mm') + ':00Z';
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

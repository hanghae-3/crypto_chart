/** 등락률에 따라 폰트 색상을 바꿀 수 있도록 하는 함수 */
export function setFontColorByFluctuationRate(change: 'RISE' | 'EVEN' | 'FALL' | undefined) {
	switch (change) {
		case 'RISE':
			return 'text-[#EF1C1C]';
		case 'EVEN':
			return 'text-[#000000]';
		case 'FALL':
			return 'text-[#1261C4]';
		default:
			return 'text-[#000000]';
	}
}

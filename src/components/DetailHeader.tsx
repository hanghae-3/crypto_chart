import useTotalMarketCodes from '../stores/useTotalMarketCodes';
import useCryptoInfo from '../stores/useCryptoInfo';

const priceLogClass = 'flex justify-between items-center text-[12px] border-b-[1px] border-[lightgray]  border-solid';

export default function DetailHeader() {
	const { selectedCrypto } = useTotalMarketCodes();
	const { selectedCryptoInfo } = useCryptoInfo();

	return (
		<nav className="text-[12px] col-span-3">
			<div className="flex col-span-2 gap-5 p-2">
				<div className="text-[19px] font-bold">{selectedCrypto ? selectedCrypto[0].korean_name : null}</div>
				<div className="text-[13px] pt-2 text-gray-400">
					{selectedCryptoInfo[0] ? selectedCryptoInfo[0].code : null}
				</div>
			</div>
			{selectedCryptoInfo[0] ? (
				<div className="grid grid-cols-[220px_1fr]">
					{/* 위쪽 */}
					<div className="grid grid-cols-[1fr_1fr] pt-2">
						<div
							className={`col-span-2 flex gap-[2px] text-[25px] font-bold ${setFontColor(selectedCryptoInfo[0].change)}`}>
							<div>
								{selectedCryptoInfo[0].trade_price ? selectedCryptoInfo[0].trade_price.toLocaleString('ko-KR') : null}
							</div>
							<div className="text-[15px] pt-2">KRW</div>
						</div>
						<div className="text-[14px] font-bold flex gap-[2px]">
							<div className="text-[12px] text-gray-400">전일대비</div>
							<div>
								{selectedCryptoInfo[0].signed_change_rate > 0 ? '+' : null}
								{(selectedCryptoInfo[0].signed_change_rate * 100).toFixed(2)}%
							</div>
						</div>
						<div className="text-[14px] font-bold">
							{selectedCryptoInfo[0].signed_change_price > 0 ? '▲' : '▼'}
							{selectedCryptoInfo[0].change_price ? selectedCryptoInfo[0].change_price.toLocaleString('ko-KR') : null}
						</div>
					</div>
					{/* 가격 */}
					<div className="grid grid-cols-[1fr_1fr_1.2fr] gap-x-3 p-[5px]">
						<div className={`${priceLogClass}`}>
							<div>고가</div>
							<div className="text-[#ef1c1c] font-bold">
								{selectedCryptoInfo[0].high_price ? selectedCryptoInfo[0].high_price.toLocaleString('ko-KR') : null}
							</div>
						</div>
						<div className={`${priceLogClass}`}>
							<div>52주 고가</div>
							<div className="text-[#ef1c1c] font-bold">
								{selectedCryptoInfo[0].highest_52_week_price
									? selectedCryptoInfo[0].highest_52_week_price.toLocaleString('ko-KR')
									: null}
							</div>
						</div>
						<div className={`${priceLogClass}`}>
							<div>거래량(24H)</div>
							<div>
								{selectedCryptoInfo[0].acc_trade_volume_24h
									? selectedCryptoInfo[0].acc_trade_volume_24h.toLocaleString('ko-KR')
									: null}
							</div>
						</div>
						<div className={`${priceLogClass}`}>
							<div>저가</div>
							<div className="text-[#1261c4] font-bold">
								{selectedCryptoInfo[0].low_price ? selectedCryptoInfo[0].low_price.toLocaleString('ko-KR') : null}
							</div>
						</div>
						<div className={`${priceLogClass}`}>
							<div>52주 저가</div>
							<div className="text-[#1261c4] font-bold">
								{selectedCryptoInfo[0].lowest_52_week_price
									? selectedCryptoInfo[0].lowest_52_week_price.toLocaleString('ko-KR')
									: null}
							</div>
						</div>
						<div className={`${priceLogClass}`}>
							<div>거래대금(24H)</div>
							<div>
								{selectedCryptoInfo[0].acc_trade_price_24h
									? selectedCryptoInfo[0].acc_trade_price_24h.toLocaleString('ko-KR')
									: null}
							</div>
						</div>
					</div>
				</div>
			) : (
				'Loading'
			)}
		</nav>
	);
}

function setFontColor(change: 'RISE' | 'EVEN' | 'FALL' | undefined) {
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

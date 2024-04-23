import { MouseEvent, useEffect } from 'react';
import useTotalMarketCodes from '../stores/useTotalMarketCodes';
import useGetTicker from '../hooks/crypto/useGetTicker';
import { convertMillonWon } from '../utils/convertMillonWon';
import useCryptoInfo from '../stores/useCryptoInfo';
import { setFontColorByFluctuationRate } from '../utils/setFontColorByFluctuationRate';

export default function CryptoSelector() {
	const { totalMarketCodes, selectedCrypto, setSelectedCrypto } = useTotalMarketCodes();
	const { setSelectedCryptoInfo } = useCryptoInfo();
	const { isConnected, socket, socketData } = useGetTicker(totalMarketCodes);

	useEffect(() => {
		if (socketData) {
			const targetData = socketData.filter((data) => data.code === selectedCrypto[0].market);
			setSelectedCryptoInfo(targetData);
		}
	}, [selectedCrypto, socketData]);

	const clickCoinHandler = (evt: MouseEvent<HTMLDivElement>) => {
		// const currentTarget = totalMarketCodes.filter((code) => code.market === evt.currentTarget.id);
		const currentTarget = totalMarketCodes.filter((code) => code.market === evt.currentTarget.id)[0];

		setSelectedCrypto(currentTarget);
	};

	return (
		<aside className="max-w-[400px] w-[350px] h-[80vh] m-[5px] bg-white overflow-y-scroll text-[12px] shadow-[0_7px_29px_0_rgba(100, 100, 111, 0.2)] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
			<nav className="sticky grid bg-white grid-cols-cryptoAside top-1 opacity-80 h-[35px] border-b-[0.5px] border-solid border-[lightgray] font-bold">
				<div className="flex items-center justify-center">코인</div>
				<div className="flex items-center justify-center">현재가</div>
				<div className="flex items-center justify-center">전일대비</div>
				<div className="flex items-center justify-center">거래대금</div>
			</nav>
			<section>
				{socketData &&
					socketData.map((data) => {
						return (
							<div
								className="h-[45px] grid grid-cols-cryptoAside border-b-[0.5px] border-solid border-[lightgrey] pl-[5px] pr-[5px] cursor-pointer hover:bg-[lightgrey]"
								key={data.code}
								id={data.code}
								onClick={clickCoinHandler}>
								<div className="flex flex-col items-start justify-center text-[11px] font-bold">
									<div>{totalMarketCodes.filter((code) => code.market === data.code)[0].korean_name}</div>
									<div className="text-[gray] font-[400] text-[7px]">
										{totalMarketCodes.filter((code) => code.market === data.code)[0].market}
									</div>
								</div>
								<div
									className={`flex items-center justify-end font-bold ${setFontColorByFluctuationRate(data.change)}`}>
									{data.trade_price?.toLocaleString('ko-KR')}
								</div>
								<div className={`flex flex-col items-end justify-center ${setFontColorByFluctuationRate(data.change)}`}>
									<div>
										{data.signed_change_rate > 0 ? '+' : null}
										{(data.signed_change_rate * 100).toFixed(2)}%
									</div>
									<div>{data.signed_change_price?.toLocaleString('ko-KR')}</div>
								</div>
								<div className="flex items-center gap-[2px] justify-end text-[11px]">
									<div>{Math.ceil(convertMillonWon(data.acc_trade_price_24h)).toLocaleString('ko-KR')}</div>
									<div className="text-[grey]">백만</div>
								</div>
							</div>
						);
					})}
			</section>
		</aside>
	);
}

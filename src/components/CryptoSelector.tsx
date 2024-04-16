import { MouseEvent, useEffect } from 'react';
import useTotalMarketCodes from '../stores/useTotalMarketCodes';
import useGetTicker from '../hooks/crypto/useGetTicker';
import { convertMillonWon } from '../utils/convertMillonWon';
import useCryptoInfo from '../stores/useCryptoInfo';

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
		<aside className="h-[80vh] overflow-y-scroll text-[12px]">
			<nav className="grid grid-cols-cryptoAside">
				<div>코인</div>
				<div>현재가</div>
				<div>전일대비</div>
				<div>거래대금</div>
			</nav>
			<section>
				{socketData &&
					socketData.map((data) => {
						return (
							<div
								className="h-[45px] grid grid-cols-cryptoAside	"
								key={data.code}
								id={data.code}
								onClick={clickCoinHandler}>
								<div>
									<div>{totalMarketCodes.filter((code) => code.market === data.code)[0].korean_name}</div>
									<div>{totalMarketCodes.filter((code) => code.market === data.code)[0].market}</div>
								</div>
								<div>{data.trade_price.toLocaleString('ko-KR')}</div>
								<div>
									<div>
										{data.signed_change_rate > 0 ? '+' : null}
										{(data.signed_change_rate * 100).toFixed(2)}%
									</div>
									<div>{data.signed_change_price.toLocaleString('ko-KR')}</div>
								</div>
								<div className="flex items-center gap-[2px]">
									<div>{Math.ceil(convertMillonWon(data.acc_trade_price_24h)).toLocaleString('ko-KR')}</div>
									<div>백만</div>
								</div>
							</div>
						);
					})}
			</section>
		</aside>
	);
}

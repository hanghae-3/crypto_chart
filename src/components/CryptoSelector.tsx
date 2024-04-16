import { MouseEvent, useEffect } from 'react';
import useTotalMarketCodes from '../stores/useTotalMarketCodes';
import useGetTicker from '../hooks/crypto/useGetTicker';
import { convertMillonWon } from '../utils/convertMillonWon';

export default function CryptoSelector() {
	const { totalMarketCodes, selectedCrypto, setSelectedCrypto } = useTotalMarketCodes();
	// console.log(totalMarketCodes);
	const { isConnected, socket, socketData } = useGetTicker(totalMarketCodes);

	useEffect(() => {
		if (socketData) {
			const targetData = socketData.filter((data) => data.code === selectedCrypto[0].market);
			// console.log(targetData);
		}
	}, [selectedCrypto, socketData]);
	const clickCoinHandler = (evt: MouseEvent<HTMLDivElement>) => {
		// const currentTarget = totalMarketCodes.filter((code) => code.market === evt.currentTarget.id);
		const currentTarget = totalMarketCodes.filter((code) => code.market === evt.currentTarget.id)[0];
		// console.log(currentTarget);
		setSelectedCrypto(currentTarget);
	};
	// console.log(socketData);

	return (
		<aside>
			<nav>
				<div>
					<div>코인</div>
					<div>현재가</div>
					<div>전일대비</div>
					<div>거래대금</div>
				</div>
			</nav>
			{socketData &&
				socketData.map((data) => {
					return (
						<section key={data.code} id={data.code} onClick={clickCoinHandler}>
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
							<div>
								<div>{Math.ceil(convertMillonWon(data.acc_trade_price_24h)).toLocaleString('ko-KR')}</div>
								<div>백만</div>
							</div>
						</section>
					);
				})}
		</aside>
	);
}

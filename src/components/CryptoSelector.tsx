import { useEffect } from 'react';
import useFetchMarketCode from '../hooks/crypto/useFetchMarketCode';

export default function CryptoSelector() {
	const { isLoading, marketCodes } = useFetchMarketCode();

	useEffect(() => {
		const KRW_MARKET_CODE = marketCodes.filter((code) => code.market.includes('KRW'));
		console.log(KRW_MARKET_CODE);
	}, [marketCodes]);

	return (
		<aside>
			<nav>
				<div>
					<div>코인</div>
					<div>현재가</div>
					<div>코인</div>
					<div>코인</div>
				</div>
			</nav>
		</aside>
	);
}

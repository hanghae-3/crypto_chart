import useFetchMarketCode from '../hooks/crypto/useFetchMarketCode';

export default function Page() {
	const { isLoading, marketCodes } = useFetchMarketCode();
	console.log(marketCodes, isLoading);

	return <div></div>;
}

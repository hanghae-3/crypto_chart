import { useEffect, useRef, useState } from 'react';
import useCryptoInfo from '../stores/useCryptoInfo';
import useTotalMarketCodes from '../stores/useTotalMarketCodes';
import useGetOrder from '../hooks/crypto/useGetOrder';
import { getChangeRate, getChangeType, getMaxSize } from '../utils/crypto_order';
import { setFontColorByFluctuationRate } from '../utils/setFontColorByFluctuationRate';

export default function OrderData() {
	const { selectedCrypto } = useTotalMarketCodes();
	const { selectedCryptoInfo } = useCryptoInfo();

	const [scrolling, setScrolling] = useState(false);
	const orderBookContainerRef = useRef<HTMLDivElement>(null);
	const { socketData } = useGetOrder(selectedCrypto.at(-1)!);
	const [maxAskSize, setMaxAskSize] = useState<number>(1);
	const [maxBidSize, setMaxBidSize] = useState<number>(1);

	const scrollHandler = () => {
		setScrolling(true);
	};

	useEffect(() => {
		if (socketData) {
			const orderbook = socketData.orderbook_units;
			const [maxAskSize, maxBidSize] = getMaxSize(orderbook);
			setMaxAskSize(maxAskSize);
			setMaxBidSize(maxBidSize);
			if (!scrolling && orderBookContainerRef.current) {
				orderBookContainerRef.current.scrollTop = orderBookContainerRef.current?.scrollHeight / 3;
			}
		}
		console.log(socketData, maxAskSize);
	}, [socketData]);

	return (
		<div ref={orderBookContainerRef} onScroll={scrollHandler} className={`bg-white h-[100%] row-span-2`}>
			{socketData && selectedCryptoInfo ? (
				<>
					{/* Ask */}
					<div className="bg-white [overflow:overlay]">
						{[...socketData.orderbook_units].reverse().map((unit, index) => (
							<div key={index} className="bg-[#cde5ff] e grid grid-cols-[1fr_1.2fr_1fr]">
								<div className="flex items-center justify-end text-[11px] h-[30px] border-[1px] border-solid border-white">
									<div
										className={`bg-[#90bfff]  w-[${(unit.ask_size / maxAskSize) * 100}%] justify-end flex items-center h-[70%]`}>
										<div className="pr-[5px] ">{unit.ask_size}</div>
									</div>
								</div>
								<div
									className={`h-[30px] border-[1px] border-white border-solid flex justify-around items-center text-[12px] ${setFontColorByFluctuationRate(getChangeType(unit.ask_price, selectedCryptoInfo.at(-1)?.prev_closing_price || 0))}`}>
									<div className="font-bold">{unit.ask_price.toLocaleString('ko-KR')}</div>
									<div>
										{getChangeRate(unit.ask_price, selectedCryptoInfo.at(-1)?.prev_closing_price as number) > 0
											? '+'
											: null}
										{getChangeRate(unit.ask_price, selectedCryptoInfo.at(-1)?.prev_closing_price as number)}%
									</div>
								</div>
								<div className="h-[30px] border-[1px] border-solid border-white bg-white"></div>
							</div>
						))}
					</div>
					{/* Bid */}
					<div className="bg-white">
						{socketData.orderbook_units.map((unit, index) => (
							<div key={index} className="bg-[#ffcdcd] e grid grid-cols-[1fr_1.2fr_1fr]">
								<div className="h-[30px] border-[1px] border-solid border-white bg-white"></div>
								<div
									className={`h-[30px] border-[1px] border-solid border-white flex justify-around items-center text-[12px]  ${setFontColorByFluctuationRate(getChangeType(unit.bid_price, selectedCryptoInfo.at(-1)?.prev_closing_price || 0))}`}>
									<div className="font-bold">{unit.bid_price.toLocaleString('ko-KR')}</div>
									<div>
										{getChangeRate(unit.bid_price, selectedCryptoInfo.at(-1)?.prev_closing_price as number) > 0
											? '+'
											: null}
										{getChangeRate(unit.bid_price, selectedCryptoInfo.at(-1)?.prev_closing_price as number)}%
									</div>
								</div>
								<div className="flex justify-start items-center text-[11px]">
									<div className="bg-[#ff9090] h-[70%] justify-start flex items-center">
										<div className="pl-[5px]">{unit.bid_size}</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
}

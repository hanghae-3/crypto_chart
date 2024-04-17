import DetailHeader from './DetailHeader';
import RealTimeChart from './RealTimeChart';

export default function CryptoDetail() {
	return (
		<section className="w-[800px] grid gap-[5px] h-[800px] grid-rows-[105px_300px_1fr] grid-cols-[1fr_1fr_1fr]">
			<DetailHeader />
			<RealTimeChart />
		</section>
	);
}
// import { useState } from 'react';
import Chart from './Chart';

export default function ChartContainer() {
	return (
		<section
			style={{
				height: '30vh',
				width: '80vw',
				border: '3px solid black',
			}}>
			<Chart />
		</section>
	);
}

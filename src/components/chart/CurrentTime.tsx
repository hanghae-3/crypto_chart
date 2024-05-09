import { useEffect, useState } from 'react';

export default function CurrentTime() {
	const [ctime, setTime] = useState(new Date().toLocaleTimeString());
	useEffect(() => {
		const updateTime = () => {
			setTime(new Date().toLocaleTimeString());
		};
		const intervalId = setInterval(updateTime);

		return () => clearInterval(intervalId);
	}, []);
	return <h1>{ctime}</h1>;
}

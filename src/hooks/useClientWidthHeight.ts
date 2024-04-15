import { type RefObject, useEffect, useState } from 'react';

export const useClientWidthHeight = (ref: RefObject<HTMLElement>) => {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	// const dpr = window.devicePixelRatio ?? 1;

	useEffect(() => {
		const setClientWidthHeight = () => {
			if (ref.current) {
				setWidth(ref.current.clientWidth);
				setHeight(ref.current.clientHeight);
			}
		};
		setClientWidthHeight();

		window.addEventListener('resize', setClientWidthHeight);

		return () => {
			window.removeEventListener('resize', setClientWidthHeight);
		};
	}, []);

	return {
		width,
		height,
		// canvasWidth: width * dpr,
		// canvasHeight: height * dpr,
	};
};

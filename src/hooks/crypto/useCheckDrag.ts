import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

export const useCheckDrag = (ref: React.RefObject<HTMLElement>, onDrag: (...args: any[]) => any) => {
	const [isDragging, setIsDragging] = useState(false);
	const [clickedX, setClickedX] = useState<number | null>(null);

	const mouseDownHandler = (e: MouseEvent) => {
		setClickedX(e.clientX);
		setIsDragging(true);
	};

	const mouseUpHandler = () => {
		setClickedX(null);
		setIsDragging(false);
	};

	const mouseMoveHandler = debounce((e: MouseEvent) => {
		if (clickedX === null || !isDragging) return;
		if (e.clientX - clickedX > 0) {
			setIsDragging(true);
			// FETCH
			onDrag();
			// console.log('fetch Time', e.clientX, clickedX);
		}
		// console.log('throttle');
	}, 1000);

	useEffect(() => {
		if (ref.current) {
			ref.current.addEventListener('mousedown', mouseDownHandler);
			ref.current.addEventListener('mousemove', mouseMoveHandler);
			ref.current.addEventListener('mouseup', mouseUpHandler);

			return () => {
				ref.current?.removeEventListener('mousedown', mouseDownHandler);
				ref.current?.removeEventListener('mousemove', mouseMoveHandler);
				ref.current?.removeEventListener('mouseup', mouseUpHandler);
			};
		}
	}, [ref, clickedX, isDragging]);

	return {
		ref,
	};
};

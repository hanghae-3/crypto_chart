import { useEffect, useRef } from 'react';

type CanvasAnimateFn = (ctx: CanvasRenderingContext2D) => void;
export const useCanvas = (canvasWidth: number, canvasHeight: number, animate: CanvasAnimateFn) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext('2d');

		const setCanvas = () => {
			if (canvas && ctx) {
				const dpr = window.devicePixelRatio ?? 1;
				canvas.width = canvasWidth * dpr;
				canvas.height = canvasHeight * dpr;
				canvas.style.width = `${canvasWidth}px`;
				canvas.style.height = `${canvasHeight}px`;
				ctx?.scale(dpr, dpr);
			}
		};
		setCanvas();

		// RAF
		let rafId: number;

		const requestAnimation = () => {
			rafId = requestAnimationFrame(requestAnimation);
			if (ctx) {
				animate(ctx);
			}
		};
		requestAnimation();

		return () => {
			cancelAnimationFrame(rafId);
		};
	}, [canvasWidth, canvasHeight, animate]);

	return canvasRef;
};

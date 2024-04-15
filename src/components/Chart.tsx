import { useCanvas } from '../hooks/useCanvas';
import { LightSource } from '../models/LightSource';
import { IPoint, Point } from '../models/Point';

type Props = {
	width: number;
	height: number;
};

export default function Chart({ width, height }: Props) {
	const lightSource = new LightSource(width, height);
	const fillBackgrorund = (ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = 'rgb(31, 31, 36)';
		ctx.fillRect(0, 0, width, height);
	};
	const points: IPoint[] = [];

	const initPoints = () => {
		const POINT_NUMBER = 72;
		const POINT_GAP = width / POINT_NUMBER;

		for (let i = 0; i <= POINT_NUMBER; i++) {
			const point = new Point(POINT_GAP, i, width, height);
			points.push(point);
		}
	};

	if (width > 0 && height > 0) {
		// Initialize points
		initPoints();
	}

	const animate = (ctx: CanvasRenderingContext2D) => {
		ctx.clearRect(0, 0, width, height);
		fillBackgrorund(ctx);
		lightSource.drawRadialGradientBehindLightSource(ctx);
		lightSource.drawLightSource(ctx);
		console.log(points);
		points.forEach((point) => {
			lightSource.drawLightLines(ctx, point.pointCenterX, point.pointCenterY);
			point.animate(ctx);
		});
	};

	const canvasRef = useCanvas(width, height, animate);

	return <canvas ref={canvasRef} />;
}

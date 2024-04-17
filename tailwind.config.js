/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				cryptoAside: '1.6fr 1fr 1fr 1.3fr',
			},
			colors: {
				cryptoTooltip: 'rgba(239, 83, 80, 1)',
				cryptoTooltipBg: 'rgba(255, 255, 255, 0.25)',
			},
			boxShadow: {
				tooltipCard: '0 2px 5px 0 rgba(117, 134, 150, 0.45)',
			},
		},
	},
	plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				cryptoAside: '1.6fr 1fr 1fr 1.3fr',
			},
		},
	},
	plugins: [],
};

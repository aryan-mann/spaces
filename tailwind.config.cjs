const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#9F7E2A',
					50: '#F3F8E4',
					100: '#EBF2CC',
					200: '#E0E59C',
					300: '#D8D26C',
					400: '#CBB33B',
					500: '#9F7E2A',
					600: '#835C23',
					700: '#66401B',
					800: '#4A2814',
					900: '#2E150C'
				},
				secondary: {
					DEFAULT: '#d81159',
					100: "#f7cfde",
					200: "#efa0bd",
					300: "#e8709b",
					400: "#e0417a",
					500: "#d81159",
					600: "#ad0e47",
					700: "#820a35",
					800: "#560724",
					900: "#2b0312"
				}
			}
		}
	},

	plugins: []
};

module.exports = config;

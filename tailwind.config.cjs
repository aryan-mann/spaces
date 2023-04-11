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
					DEFAULT: '#7EA3D7',
					50: '#FFFFFF',
					100: '#FBFCFE',
					200: '#DCE6F4',
					300: '#BDD0EB',
					400: '#9DBAE1',
					500: '#7EA3D7',
					600: '#5385CA',
					700: '#3669B0',
					800: '#294F85',
					900: '#1C355A'
				}
			}
		}
	},

	plugins: []
};

module.exports = config;

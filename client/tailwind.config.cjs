/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      colors: {
        'amazon-header-bg': {
          DEFAULT: '#242F3E',
          dark: "#131921"
        }
      }
    },
	},
	plugins: [],
}

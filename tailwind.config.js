/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'pls-cyan': '#00f2ff',
                'pls-purple': '#9d3cff',
                'pls-red': '#ff3c41',
                'pls-green': '#3cff8e',
            }
        },
    },
    plugins: [],
}

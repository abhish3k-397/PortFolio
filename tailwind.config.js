/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                cyber: {
                    red: '#ff003c',
                    yellow: '#fcee0a',
                    blue: '#0b0c15',
                    neon: '#00f3ff'
                }
            },
            animation: {
                'scanline': 'scanline 8s linear infinite',
            },
            keyframes: {
                scanline: {
                    '0%': { backgroundPosition: '0% 0%' },
                    '100%': { backgroundPosition: '0% 100%' },
                }
            }
        },
    },
    plugins: [],
}

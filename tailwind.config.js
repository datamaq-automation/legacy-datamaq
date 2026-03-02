/** @type {import('tailwindcss').Config} */
export default {
    prefix: 'tw',
    important: true,
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dm-primary': '#ff6a00',
                'dm-accent': '#ff9a4d',
                'dm-bg': '#0c092f',
                'dm-surface': '#0f1b3a',
                'dm-border': '#2b3d6a',
                'dm-text-0': '#e2e9f3',
                'dm-text-muted': '#99a9d1',
            }
        },
    },
    plugins: [],
}

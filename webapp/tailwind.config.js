const plugin = require('tailwindcss/plugin');

module.exports = {
    purge: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            animation: {
                fadeIn: 'ease-out 0.3s 1 forwards fadeIn ',
                fadeOut: 'ease-out 0.3s 1 normal forwards fadeOut',
                anchorLeftSlideRight:
                    'cubic-bezier(0.68, 0.01, 0.22, 1) 0.5s 1 normal forwards anchorLeftSlideRight',
                anchorLeftSlideLeft:
                    'cubic-bezier(0.68, 0.01, 0.22, 1) 0.5s 1 normal forwards anchorLeftSlideLeft',
                anchorRightSlideLeft:
                    'cubic-bezier(0.68, 0.01, 0.22, 1) 0.5s 1 normal forwards anchorRightSlideLeft',
                anchorRightSlideRight:
                    'cubic-bezier(0.68, 0.01, 0.22, 1) 0.5s 1 normal forwards anchorRightSlideRight',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                fadeOut: {
                    '0%': { opacity: 1 },
                    '99.9%': { opacity: 0, visibility: 'visible' },
                    '100%': { opacity: 0, visibility: 'hidden' },
                },
                anchorLeftSlideRight: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                anchorLeftSlideLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                anchorRightSlideRight: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                anchorRightSlideLeft: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            height: (theme) => ({
                'screen-header': 'calc(100vh - 85px)',
            }),
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            colors: {
                plue: '#4938FF',
                'color-primary': 'var(--color-bg-primary)',
                'color-secondary': 'var(--color-bg-secondary)',
                'text-primary': 'var(--color-text-primary)',
                dplue: '#382ACA',
                vertipurp: '#4938FF',
                gray: {
                    3: '#f3f5f7',
                    2: '#e2e3e6',
                    1: '#757980',
                },
                black: {
                    natural: '#1a1a1c',
                },
                flameorange: {
                    1: '#ff553e',
                    2: '#FF237F',
                },
                error: '#f42069',
                flamepink: '#ff237f',
            },
            backgroundImage: {
                none: 'none',
                'gradient-radial-top-left-bottom-right': 'radial-gradient(circle at top left, #3EA5FF 0, #4938FF, transparent 100%), radial-gradient(circle at bottom right, #841FFF 0, #4938FF, transparent 100%)',
                'pipeline-full-logo':
                    'url(https://uploads-ssl.webflow.com/5f2988fa28091b883126c76e/5f3170120c8f202fdbe645af_Pipeline_White-NoBG.png)',
                'sample-partner': "url('/content/sample.png')",
            },
            width: {
                '1/8': '12.5%',
            },
            maxWidth: {
                '102': '102%',
            },
            inset: {
                '0': 0,
                '80': '80px',
                '5/100': '5%',
                '1/2':'50%',
                '1/8': '12.5%',
            },
            transformOrigin: {
                '1': '1px',
            },
            spacing: {
                px: '1px',
                0: '0px',
                0.5: '4px',
                1: '8px',
                1.5: '12px',
                2: '16px',
                2.5: '20px',
                3: '24px',
                3.5: '28px',
                4: '32px',
                5: '40px',
                6: '48px',
                7: '56px',
                8: '64px',
                9: '72px',
                10: '80px',
                11: '88px',
                12: '96px',
                14: '112px',
                16: '128px',
                20: '160px',
                24: '192px',
                28: '224px',
                32: '256px',
                36: '288px',
                40: '320px',
                44: '352px',
                48: '384px',
                52: '416px',
                56: '448px',
                60: '480px',
                64: '512px',
                72: '576px',
                80: '640px',
                96: '768px',
                '16by9': '56.25%',
            },

            fontSize: {
                'heading-1': [
                    '4rem',
                    { lineHeight: '4.375rem' },
                    { fontWeight: '600' },
                ],
                'heading-2': [
                    '2.5rem',
                    { lineHeight: '3rem' },
                    { fontWeight: '600' },
                ],
                'heading-3': [
                    '1.5rem',
                    { lineHeight: '2rem' },
                    { fontWeight: '600' },
                ],
                'heading-4': [
                    '1.25rem',
                    { lineHeight: '1.75rem' },
                    { fontWeight: '600' },
                ],
                'heading-5': [
                    '1rem',
                    { lineHeight: '1.5rem' },
                    { fontWeight: '500' },
                ],
                'heading-6': [
                    '0.875rem',
                    { lineHeight: '1.25rem' },
                    { fontWeight: '500' },
                ],
                body: [
                    '1rem',
                    { lineHeight: '1.75rem' },
                    { fontWeight: '400' },
                ],
                'bg-sub': [
                    '0.75rem',
                    { lineHeight: '1.5rem' },
                    { fontWeight: '500' },
                ],
                'sm-sub': [
                    '0.6875rem',
                    { lineHeight: '1.125rem' },
                    { fontWeight: '400' },
                ],
            },
        },
    },
    variants: {
        border: ({ after }) => after(['first-of-type']),
    },
    plugins: [
        require('@tailwindcss/forms'),
        plugin(function ({ addVariant, e }) {
            addVariant('first-of-type', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.${e(
                        `first-of-type${separator}${className}`
                    )}:first-of-type`;
                });
            });
        }),
    ],
};

import { extend } from 'jquery';

/** @type {import('tailwindcss').Config} */

export const content = [
  './src/**/*.{html,ts}',
  './node_modules/flowbite/**/*.js',
  './node_modules/flowbite/**/*.ts',
];
export const theme = {
  extend: {
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
    },
    colors: {
      primario: '#1c398e',
      black: '#0a0a0a',
      hoverButton: '#162456',
      textGray: '#737373',
      colorButton: '#4EAAC1',
      colorButtonHover: '#3f889a',
      gris: '#f9fafb',
      gray700: '#364153',
      gray600: '#4a5565',
      gray500: '#6a7282',
      gray400: '#99a1af',
      gray300: '#d1d5dc',
      gray200: '#e5e7eb',
      gray100: '#f3f4f6',
      amber50: '#fffbeb',
      amber100: '#fef3c6',
      amber300: '#ffd230',
      amber200: '#fee685',
      amber400: '#ffba00',
      amber500: '#fd9a00',
      amber600: '#e17100',
      green100: '#dcfce7',
      green200: '#b9f8cf',
      green300: '#7bf1a8',
      green400: '#05df72',
      green500: '#00c9510',
      green600: '#00a63e',
      blue100: '#dbeafe',
      blue200: '#bedbff',
      blue300: '#8ec5ff',
      blue400: '#51a2ff',
      blue500: '#2b7fff',
      blue600: '#155dfc',
      transparent: 'transparent',
      bgTeal100: '#cbfbf1',
      textAlertSucces: '#0b4f4a',
      textTeal500: '#00bba7',
    },
    screens: {
      xxs: { max: '360px' },
      xms: { max: '435px' },
      xs: { max: '639px' },
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      fadeOut: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.1s ease-in',
      fadeOut: 'fadeOut 0.1s ease-out',
    },
    variants: {
      opacity: ['responsive', 'hover', 'group-hover'],
      translate: ['responsive', 'hover', 'group-hover'],
    },
  },

  plugins: [require('tailwindcss'), require('autoprefixer')],
};

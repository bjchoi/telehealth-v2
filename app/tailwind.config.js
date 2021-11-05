const colors = require('tailwindcss/colors');

const theme = {
  primary: '#F12E45',
  secondary: '#0D122B',
  tertiary: '#676767',
};

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        ...colors,
        ...theme,
        button: {
          ...theme,
        },
        twilio: {
          red: '#F12E45',
          blue: '#0D122B',
          gray: '#676767',
          'light-gray': '#C2C2C2',
        },
      },
      boxShadow: {
        card: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        patientHeader: '0px 4px 11px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

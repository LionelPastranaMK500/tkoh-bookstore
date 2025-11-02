import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Habilita el modo oscuro basado en una clase en el HTML
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Escanea todos los archivos relevantes en src
  ],
  prefix: '', // Sin prefijo para las clases de Tailwind
  theme: {
    container: {
      center: true, // Centra los contenedores por defecto
      padding: '2rem', // Añade padding por defecto
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // NOTA: Los colores, bordes, etc., de shadcn/ui
      // se definen en src/styles/index.css usando variables CSS.
      // Esta sección se usa para animaciones.
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    // Plugin requerido por shadcn/ui para las animaciones
    require('tailwindcss-animate'),
  ],
};

export default config;

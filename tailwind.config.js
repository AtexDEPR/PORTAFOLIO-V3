module.exports = {
    content: [
      './index.html',
      './assets/css/styles.css',
      './assets/css/animations.css', // Ruta de tu archivo de animaciones
      // Asegúrate de incluir todas las rutas relevantes donde estés utilizando TailwindCSS
    ],
    theme: {
      extend: {
        animation: {
          // Animaciones de rebote
          'bounce': 'bounce 1s ease infinite',
          'blur-fade-in': 'blurFadeIn 2s ease-out forwards',
          'zoom-rotate': 'zoomRotate 2s ease-in-out forwards',
  
          // Animaciones adicionales
          'rotate-in': 'rotateIn 1.5s ease-out forwards',
          'slide-up': 'slideUp 1.5s ease-out forwards',
          'pulse-color': 'pulseColor 2s infinite',
          'shake': 'shake 0.5s ease-in-out infinite',
          'flip': 'flip 2s ease-in-out forwards',
          'scale-up': 'scaleUp 2s ease-out forwards',
          'slide-left': 'slideLeft 1.5s ease-out forwards',
          'zoom-in': 'zoomIn 2s ease-out forwards',
          'fade-in': 'fadeIn 2s ease-out forwards',
          'spin': 'spin 2s linear infinite',
          'pulse-grow': 'pulseGrow 1.5s infinite',
        },
        keyframes: {
          'bounce': {
            '0%': { transform: 'translateY(0)' },
            '30%': { transform: 'translateY(-10px)' },
            '50%': { transform: 'translateY(0)' },
            '70%': { transform: 'translateY(-5px)' },
            '100%': { transform: 'translateY(0)' },
          },
          'blurFadeIn': {
            '0%': { opacity: '0', filter: 'blur(10px)' },
            '100%': { opacity: '1', filter: 'blur(0)' },
          },
          'zoomRotate': {
            '0%': { transform: 'scale(1) rotate(0deg)' },
            '100%': { transform: 'scale(1.5) rotate(180deg)' },
          },
          'rotateIn': {
            '0%': { transform: 'rotate(-90deg)', opacity: '0' },
            '100%': { transform: 'rotate(0)', opacity: '1' },
          },
          'slideUp': {
            '0%': { transform: 'translateY(50px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          'pulseColor': {
            '0%': { backgroundColor: '#FF0000' },
            '50%': { backgroundColor: '#00FF00' },
            '100%': { backgroundColor: '#0000FF' },
          },
          'shake': {
            '0%': { transform: 'translateX(0)' },
            '25%': { transform: 'translateX(-10px)' },
            '50%': { transform: 'translateX(10px)' },
            '75%': { transform: 'translateX(-10px)' },
            '100%': { transform: 'translateX(0)' },
          },
          'flip': {
            '0%': { transform: 'rotateY(0)' },
            '100%': { transform: 'rotateY(180deg)' },
          },
          'scaleUp': {
            '0%': { transform: 'scale(1)' },
            '100%': { transform: 'scale(1.2)' },
          },
          'slideLeft': {
            '0%': { transform: 'translateX(100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
          'zoomIn': {
            '0%': { transform: 'scale(0.8)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
          'fadeIn': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          'spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          'pulseGrow': {
            '0%': { transform: 'scale(1)', opacity: '0.5' },
            '50%': { transform: 'scale(1.1)', opacity: '1' },
            '100%': { transform: 'scale(1)', opacity: '0.5' },
          },
        }
      },
    },
    plugins: [],
  }
  
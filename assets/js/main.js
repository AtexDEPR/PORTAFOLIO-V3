// main.js

// Efecto de animación al pasar el mouse sobre los íconos de habilidades
document.querySelectorAll('.flex').forEach(item => {
    item.addEventListener('mouseover', () => {
      item.classList.add('scale-110');
    });
    item.addEventListener('mouseout', () => {
      item.classList.remove('scale-110');
    });
  });
  
  // Selección de elementos
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');

    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden'); // Alternar clase Tailwind para mostrar/ocultar
    });

function obtenerTareasGuardadas() {
  const tareasGuardadas = localStorage.getItem('tareas');
  return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
}


function guardarTareas(tareas) {
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

document.addEventListener('DOMContentLoaded', () => {
  
  const estilos = document.createElement('style');
  estilos.textContent = `
      @media (max-width: 640px) {
          .todo-container { max-width: 100% !important; padding: 1rem !important; }
          .task-item { flex-direction: column !important; }
      }
      @media (min-width: 641px) and (max-width: 1024px) {
          .todo-container { max-width: 80% !important; }
      }
      .task-completed {
          background-color: rgba(0, 0, 0, 0.7) !important;
          transition: all 0.3s ease;
      }
      .task-completed span {
          color: #10B981 !important;
          text-decoration: line-through;
      }
  `;
  document.head.appendChild(estilos);

  
  const aplicacion = document.createElement('div');
  aplicacion.className = 'todo-container bg-black shadow-2xl rounded-lg p-8 w-full max-w-md bg-opacity-10 mx-auto mt-10';

  
  const titulo = document.createElement('h1');
  titulo.className = 'text-2xl font-bold text-center mb-6 text-white';
  titulo.textContent = 'Mis Tareas';

  
  const contenedorEntrada = document.createElement('div');
  contenedorEntrada.className = 'mb-4';

  
  const entrada = document.createElement('input');
  entrada.type = 'text';
  entrada.placeholder = 'Escribe una tarea';
  entrada.className = 'w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';

  
  const botonAgregar = document.createElement('button');
  botonAgregar.textContent = 'Agregar Tarea';
  botonAgregar.className = 'mt-4 w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition duration-300';

  
  const listaTareas = document.createElement('div');
  listaTareas.className = 'mb-4 mt-6';

  
  const tareas = obtenerTareasGuardadas().map(tarea => ({
      texto: tarea.texto,
      completada: tarea.completada || false
  }));

  
  function agregarTarea() {
      const valorTarea = entrada.value.trim();
      if (valorTarea) {
          tareas.push({ texto: valorTarea, completada: false });
          guardarTareas(tareas);
          renderizarTareas();
          entrada.value = '';
      }
  }

  
  botonAgregar.addEventListener('click', agregarTarea);
  entrada.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          event.preventDefault();
          agregarTarea();
      }
  });

  
  function renderizarTareas() {
      listaTareas.innerHTML = '';
      tareas.forEach((tarea, indice) => {
          const elementoTarea = document.createElement('div');
          elementoTarea.className = `task-item flex justify-between items-center bg-blue-100 px-4 py-3 mb-2 rounded-md ${tarea.completada ? 'task-completed' : ''}`;

          
          const textoTarea = document.createElement('span');
          textoTarea.textContent = tarea.texto;
          textoTarea.className = 'text-lg flex-grow';

          
          const contenedorBotones = document.createElement('div');
          contenedorBotones.className = 'flex items-center gap-2';

          
          const botonCompletar = document.createElement('button');
          botonCompletar.innerHTML = '✔';
          botonCompletar.className = `text-${tarea.completada ? 'green' : 'gray'}-500 hover:text-green-700 px-2`;
          botonCompletar.addEventListener('click', () => {
              tareas[indice].completada = !tareas[indice].completada;
              guardarTareas(tareas);
              renderizarTareas();
          });

          
          const botonEliminar = document.createElement('button');
          botonEliminar.innerHTML = '✖';
          botonEliminar.className = 'text-red-500 hover:text-red-700 px-2';
          botonEliminar.addEventListener('click', () => {
              tareas.splice(indice, 1);
              guardarTareas(tareas);
              renderizarTareas();
          });

          
          contenedorBotones.appendChild(botonCompletar);
          contenedorBotones.appendChild(botonEliminar);
          elementoTarea.appendChild(textoTarea);
          elementoTarea.appendChild(contenedorBotones);
          listaTareas.appendChild(elementoTarea);
      });
  }

  
  contenedorEntrada.appendChild(entrada);
  contenedorEntrada.appendChild(botonAgregar);
  aplicacion.appendChild(titulo);
  aplicacion.appendChild(contenedorEntrada);
  aplicacion.appendChild(listaTareas);
  document.body.appendChild(aplicacion);

  
  renderizarTareas();
});
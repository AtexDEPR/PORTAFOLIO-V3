// Al cargar el documento, muestra el modal del nuevo juego y enfoca el botón de inicio
$(document).ready(function () {
  $('#newGame').modal(
    { 'dismissible': false });  // Evita que se cierre el modal al hacer clic fuera
  $('#newGame').modal('open');  // Abre el modal al cargar la página
  $("#newGameBtn").focus();  // Enfoca el botón de iniciar juego
});

// Carga los puntajes más altos desde la API
loadHighScores();

let highScoreMin;

// Función para cargar los puntajes más altos desde la base de datos
function loadHighScores() {
  $.ajax({
    url: 'https://api.mlab.com/api/1/databases/tetrishighscores/collections/scores?s={"score":-1}&apiKey=E8dx03lqLdc5pG_K002t_lJrPOwDi1vG', // URL de la API con la clave
    type: "GET",  // Tipo de solicitud HTTP
    success: (data) => {  // En caso de éxito, procesa los datos
      let scoreLog = `<p class="score-title"><u>High Scores:</u></p>`;  // Título para la lista de puntajes
      highScoreMin = data[10].score;  // El puntaje mínimo para mostrar los 10 mejores puntajes
      // Recorre los 10 primeros puntajes y los muestra en el log
      for (var i = 0; i <= 10; i++) {
        scoreLog += `<p>${data[i].name.slice(0, 7)}: ${data[i].score}</p>`;
      }
      // Inyecta el log de puntajes más altos en el contenedor de la interfaz
      $('.highScores').html(scoreLog);
    },
    error: (xhr, status, err) => {  // En caso de error, muestra el error en la consola
      console.log(err);
    }
  });
}

// Variable para controlar el estado de pausa del juego
let pause = true;

// Obtener el canvas del juego y su contexto
const canvas = document.querySelector('.tetris');
const context = canvas.getContext('2d');

// Obtener el canvas para la próxima pieza y su contexto
const nextCanvas = document.querySelector('.next');
const nextContext = nextCanvas.getContext('2d');

// Escala el contexto para las piezas del juego y las de la próxima pieza
context.scale(20, 20);
nextContext.scale(30, 30);

// Crea las matrices para el área de juego y la de la próxima pieza
const arena = createMatrix(12, 20);
const nextArena = createMatrix(6, 6);

// Configuración del jugador
const player = {
  pos: { x: 0, y: 0 },  // Posición inicial del jugador
  matrix: null,  // La matriz de la pieza del jugador (será asignada más tarde)
  score: 0,  // Puntaje inicial
  level: 1,  // Nivel inicial
  dropInterval: 1000,  // Intervalo de caída de las piezas
  DROP_SLOW: 100,  // Velocidad de caída lenta
  next: null,  // La próxima pieza que caerá
};

// Variable para contar el tiempo de caída
let dropCounter = 0;
let DROP_FAST = 50;  // Velocidad de caída rápida

// Función para limpiar filas completas del área de juego y sumar puntos
function arenaSweep() {
  let rowCount = 1;
  outer: for (y = arena.length - 1; y > 0; y--) {
    for (x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) {
        continue outer;  // Si no hay un bloque en la fila, pasa a la siguiente fila
      }
    }
    // Si la fila está llena, la limpia y agrega una nueva al principio
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    y++;

    // Sumar puntos dependiendo de la cantidad de filas eliminadas
    player.score += rowCount * 100;
    rowCount *= 2;

    // Calcular el nivel y ajustar la velocidad de caída de las piezas
    let scoreStr = player.score.toString();
    if (scoreStr.length > 3) {
      let num = Number(scoreStr.slice(0, scoreStr.length - 3));
      player.level = num + 1;
      player.dropInterval = 1000 - (num * 50);
      player.DROP_SLOW = 1000 - (num * 50);
    }
  }
}

// Función para verificar si una pieza colisiona con otras piezas o el borde
function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (y = 0; y < m.length; y++) {
    for (x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;  // Si hay colisión, retorna verdadero
      }
    }
  }
  return false;  // Si no hay colisión, retorna falso
}

// Función para crear una matriz vacía para el área de juego
function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));  // Rellena la matriz con ceros
  }
  return matrix;
}

// Función para crear una pieza dependiendo del tipo
function createPiece(type) {
  if (type === 'I') {
    return [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ];
  } else if (type === 'J') {
    return [
      [0, 2, 0],
      [0, 2, 0],
      [2, 2, 0]
    ];
  } else if (type === 'L') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3]
    ];
  } else if (type === 'O') {
    return [
      [4, 4],
      [4, 4]
    ];
  } else if (type === 'S') {
    return [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0]
    ];
  } else if (type === 'T') {
    return [
      [0, 0, 0],
      [6, 6, 6],
      [0, 6, 0]
    ];
  } else if (type === 'Z') {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0]
    ];
  }
}

// Función para dibujar la próxima pieza en el canvas correspondiente
function drawNext() {
  nextContext.fillStyle = '#000';  // Establece el color de fondo
  nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);  // Dibuja el fondo

  // Dibuja las piezas dentro de la próxima área
  drawMatrix(nextArena, { x: 0, y: 0 }, nextContext);
  drawMatrix(player.next, { x: 1, y: 1 }, nextContext);
}

// Función para dibujar el juego actual en el canvas
function draw() {
  context.fillStyle = '#000';  // Establece el color de fondo
  context.fillRect(0, 0, canvas.width, canvas.height);  // Dibuja el fondo

  // Dibuja las matrices del área de juego y la pieza del jugador
  drawMatrix(arena, { x: 0, y: 0 }, context);
  drawMatrix(player.matrix, player.pos, context);
}


function drawMatrix(mat, offset, cont) {
  mat.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        // Configura el color según el valor
        cont.fillStyle = colors[value];

        // Dibuja la ficha con bordes redondeados y sombra
        cont.save(); // Guardar el estado actual de contexto
        cont.beginPath();
        cont.arc(x + offset.x + 0.5, y + offset.y + 0.5, 0.5, 0, Math.PI * 2);
        cont.closePath();

        // Sombra para dar efecto de profundidad
        cont.shadowColor = 'rgba(0, 0, 0, 0.3)';
        cont.shadowBlur = 5;
        cont.shadowOffsetX = 2;
        cont.shadowOffsetY = 2;

        // Relleno de la ficha con el color
        cont.fill();
        cont.restore(); // Restaurar el contexto

        // Agregar un borde más definido (opcional)
        cont.lineWidth = 0.3;
        cont.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        cont.stroke();
      }
    });
  });
}


// Función que fusiona la matriz del jugador con la matriz del área de juego
function merge(arena, player) {
  // Itera sobre cada celda de la matriz del jugador
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      // Si la celda del jugador tiene un valor distinto de cero, se coloca en la arena
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

// Función que maneja la caída del jugador
function playerDrop() {
  player.pos.y++;
  // Si el jugador colide con algún bloque en la arena, la caída se detiene
  if (collide(arena, player)) {
    player.pos.y--;  // Retrocede la posición del jugador
    merge(arena, player);  // Fusiona la matriz del jugador con la arena
    playerReset();  // Resetea la posición y pieza del jugador
    arenaSweep();  // Elimina filas completas de la arena
    updateScore();  // Actualiza la puntuación
  }
  dropCounter = 0;  // Resetea el contador de caída
}

// Función que mueve al jugador hacia la izquierda o derecha
function playerMove(dir) {
  player.pos.x += dir;
  // Si el movimiento colisiona con la arena, revierte el movimiento
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

// Función que reinicia la posición del jugador y genera una nueva pieza
function playerReset() {
  const pieces = 'IJLOSTZ';
  // Si el jugador no tiene una pieza siguiente, genera una nueva
  if (player.next === null) {
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.next = createPiece(pieces[pieces.length * Math.random() | 0]);
  } else {
    player.matrix = player.next;  // La pieza siguiente se convierte en la actual
    player.next = createPiece(pieces[pieces.length * Math.random() | 0]);  // Genera una nueva pieza siguiente
  }
  drawNext();  // Dibuja la siguiente pieza
  player.pos.y = 0;  // Posiciona al jugador en la parte superior
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);  // Centra la pieza
  // Si el jugador colide al iniciar, se pausa el juego
  if (collide(arena, player)) {
    pauseGame();
    document.removeEventListener('keydown', keyListener);
    document.removeEventListener('keyup', keyListener);
    // clearPlayer();  // Limpiar jugador (no usado en este fragmento)
  }
}

// Función que limpia el área de juego y reinicia el puntaje
function clearPlayer() {
  player.dropInterval = 1000;  // Intervalo de caída por defecto
  player.DROP_SLOW = 1000;
  player.score = 0;  // Puntuación reiniciada
  player.level = 1;  // Nivel reiniciado
  arena.forEach(row => row.fill(0));  // Limpia el área de juego
  updateScore();  // Actualiza la puntuación
}

// Función que rota la pieza del jugador
function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);  // Rota la matriz de la pieza

  // Verifica si la rotación provoca colisión, y ajusta la posición si es necesario
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);  // Revierte la rotación si es necesario
      player.pos.x = pos;  // Restaura la posición inicial
      return;
    }
  }
}

// Función que rota la matriz de una pieza
function rotate(matrix, dir) {
  for (y = 0; y < matrix.length; y++) {
    for (x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];  // Realiza una rotación 90 grados
    }
  }
  // Si la rotación es en sentido horario, invierte cada fila
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();  // Si es antihorario, invierte la matriz completa
  }
}

// Función de actualización del juego
let lastTime = 0;
function update(time = 0) {
  $('#pause').off();  // Desactiva eventos de pausa
  if (!pause) {
    const deltaTime = time - lastTime;  // Calcula el tiempo transcurrido
    lastTime = time;
    dropCounter += deltaTime;  // Actualiza el contador de caída
    // Si el contador supera el intervalo de caída, deja caer al jugador
    if (dropCounter > player.dropInterval) {
      playerDrop();
    }
    draw();  // Dibuja el estado actual del juego
    requestAnimationFrame(update);  // Solicita la siguiente actualización de la animación
  } else {
    draw();  // Si está pausado, solo dibuja el juego
  }
}

// Función para actualizar la puntuación en la interfaz de usuario
function updateScore() {
  document.querySelector('.score').innerHTML = `<p><b><u>Score:</u> ${player.score}</b></p>`;
  document.querySelector('.level').innerHTML = `<p><b><u>Level:</u> ${player.level}</b></p>`;
}

// Definición de colores para cada tipo de pieza
const colors = [
  null,
  '#FF5722', // I - Naranja vibrante
  '#7C4DFF', // J - Violeta eléctrico
  '#FFEB3B', // L - Amarillo neón
  '#e74c3c', // O - Rojo intenso
  '#00E676', // S - Verde neón
  '#FF4081', // T - Fucsia brillante
  '#3498db'  // Z - Azul neón
];

// Función que maneja la escucha de teclas
function keyListener(e) {
  if (e.type === 'keydown') {
    if (e.keyCode === 37) {
      playerMove(-1);  // Mueve la pieza a la izquierda
    } else if (e.keyCode === 39) {
      playerMove(1);  // Mueve la pieza a la derecha
    } else if (e.keyCode === 81) {
      playerRotate(-1);  // Rota la pieza hacia la izquierda
    } else if (e.keyCode === 87 || e.keyCode === 38) {
      playerRotate(1);  // Rota la pieza hacia la derecha
    } else if (e.keyCode === 27) {
      pauseGame();  // Pausa el juego
    }
  }

  // Si se presiona la flecha hacia abajo, el jugador cae más rápido
  if (e.keyCode === 40) {
    if (e.type === 'keydown') {
      if (player.dropInterval !== DROP_FAST) {
        playerDrop();
        player.dropInterval = DROP_FAST;
      }
    } else {
      player.dropInterval = player.DROP_SLOW;  // Restablece el intervalo de caída
    }
  }
}

// Función que pausa el juego
function pauseGame() {
  if (pause === true) {
    pause = false;
    $('#pause').modal({ "onCloseStart": update() });  // Muestra el modal de pausa
    $('#pause').modal('close');
  } else {
    if (collide(arena, player)) {
      pause = true;
      if (player.score > 0) {
        $('#gameOver').modal({
          'dismissible': false,
          "onOpenEnd": function () { $('#name').focus(); }
        });
        $('#gameOver').modal('open');
        $('.yourScore').html(`<p>Your Score: ${player.score}`)
      } else {
        $('#newGame').modal({ 'dismissible': false });
        $('#newGame').modal('open');
      }
    } else {
      pause = true;
      document.createEventListener
      $('#pause').modal({
        "dismissible": false,
        "onCloseStart": update()
      });
      $('#pause').modal('open');
      $("#pauseBtn").focus();
      $('body').on('keydown', (e) => {
        if (e.keyCode === 39) {
          $('#StartNewBtn').focus();
        }
        if (e.keyCode === 37) {
          $("#pauseBtn").focus();
        }
      })
    }
  }
}

// Función que inicia un nuevo juego
function newGame() {
  loadHighScores();
  clearPlayer();
  pause = false;
  playerReset();
  update();
  updateScore();
  document.addEventListener('keydown', keyListener);
  document.addEventListener('keyup', keyListener);
}

// Realiza una solicitud AJAX para enviar el puntaje del jugador a una base de datos remota
$.ajax({
  // URL de la API de mLab, donde se almacenan los puntajes de Tetris
  url: 'https://api.mlab.com/api/1/databases/tetrishighscores/collections/scores?apiKey=E8dx03lqLdc5pG_K002t_lJrPOwDi1vG',
  
  // Los datos que se enviarán a la base de datos en formato JSON
  data: JSON.stringify({
    "date": new Date,  // La fecha y hora actuales
    "name": name,  // El nombre del jugador
    "score": player.score,  // El puntaje actual del jugador
    "level": player.level  // El nivel alcanzado por el jugador
  }),

  // El método HTTP utilizado para la solicitud (en este caso, POST)
  type: "POST",

  // El tipo de contenido de los datos que se enviarán (JSON)
  contentType: "application/json",

  // Función que se ejecutará si la solicitud es exitosa
  success: (data) => {
    // Muestra un mensaje de agradecimiento al usuario
    $('#highScore').html('<h4>Thank You!</h4>');
  },

  // Función que se ejecutará si ocurre un error durante la solicitud
  error: (xhr, status, err) => {
    // Muestra el error en la consola
    console.log(err);
  }
});

// Llama a la función `update` para actualizar el estado del juego
update();

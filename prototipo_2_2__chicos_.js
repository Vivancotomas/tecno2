let gridSize = 150; // Tamaño de cada celda de la cuadrícula
let cols, rows;
let squares = [];
let maxSquares = 80; // Máximo de imágenes en cada lado
let images = []; // Array para almacenar las imágenes
let margin = 1; // Margen reducido para evitar que los cuadrados toquen los bordes del lienzo
let lastAddTime = 0; // Tiempo de la última vez que se agregó un cuadrado
let addInterval = 200; // Intervalo mínimo en milisegundos entre la creación de nuevos cuadrados
let warmTintActive = false; // Variable para controlar si el tinte cálido está activado
let coolTintActive = false; // Variable para controlar si el tinte frío está activado

function preload() {
  // Carga las imágenes antes de que comience el programa
  images.push(loadImage('data/imagen0.png'));
  images.push(loadImage('data/imagen2.png'));
  images.push(loadImage('data/imagen3.png'));
  images.push(loadImage('data/imagen4.png'));
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Tamaño del lienzo para ajustarse a la ventana
  cols = width / gridSize;
  rows = height / gridSize;
  // Inicialmente, agregamos una imagen en el centro del lado izquierdo y una en el centro del lado derecho
  squares.push({ pos: createVector(floor(cols / 4), floor(rows / 2)), img: random(images), side: 'left' });
  squares.push({ pos: createVector(floor(3 * cols / 4), floor(rows / 2)), img: random(images), side: 'right' });
}

function draw() {
  //background(0, 200, 120);
  drawSquares();
}

function drawSquares() {
  for (let s of squares) {
    if (warmTintActive) {
      tint(255, 165, 0); // Aplica un tinte cálido (naranja)
    } else if (coolTintActive) {
      tint(0, 255, 255); // Aplica un tinte frío (celeste)
    } else {
      noTint(); // Desactiva el tinte
    }
    image(s.img, s.pos.x * gridSize - gridSize / 2, s.pos.y * gridSize - gridSize / 2, gridSize * 2, gridSize * 2); // Ajusta el tamaño de la imagen
  }
}

function mouseDragged() {
  let currentTime = millis(); // Obtiene el tiempo actual
  if (currentTime - lastAddTime >= addInterval) { // Verifica si ha pasado suficiente tiempo
    let leftCount = squares.filter(s => s.side === 'left').length;
    let rightCount = squares.filter(s => s.side === 'right').length;

    if (leftCount >= maxSquares && rightCount >= maxSquares) return;

    let newSquare = getValidSquare();
    if (newSquare) {
      squares.push(newSquare);
      lastAddTime = currentTime; // Actualiza el tiempo de la última adición
    }
  }
}

function getValidSquare() {
  let options = [];

  for (let s of squares) {
    let x = s.pos.x;
    let y = s.pos.y;

    let potentialSquares = [
      createVector(x + 1, y + 1), // Esquina inferior derecha
      createVector(x - 1, y - 1), // Esquina superior izquierda
      createVector(x + 1, y - 1), // Esquina superior derecha
      createVector(x - 1, y + 1)  // Esquina inferior izquierda
    ];

    for (let ps of potentialSquares) {
      if (ps.x >= margin && ps.x < cols - margin && ps.y >= margin && ps.y < rows - margin && !isOccupied(ps)) {
        if (s.side === 'left' && ps.x < cols / 2) {
          options.push({ pos: ps, img: random(images), side: 'left' });
        } else if (s.side === 'right' && ps.x >= cols / 2) {
          options.push({ pos: ps, img: random(images), side: 'right' });
        }
      }
    }
  }

  if (options.length > 0) {
    return random(options);
  }
  return null;
}

function isOccupied(position) {
  for (let s of squares) {
    if (dist(s.pos.x, s.pos.y, position.x, position.y) < 1) {
      return true;
    }
  }
  return false;
}

function keyPressed() {
  if (key === 'C' || key === 'c') {
    warmTintActive = !warmTintActive; // Cambia el estado del tinte cálido
    coolTintActive = false; // Asegúrate de que el tinte frío esté desactivado
  } else if (key === 'F' || key === 'f') {
    coolTintActive = !coolTintActive; // Cambia el estado del tinte frío
    warmTintActive = false; // Asegúrate de que el tinte cálido esté desactivado
  } else if (key === '0') {
    background(0); // Cambia el color de fondo a negro
  } else if (key === '1') {
    background(255); // Cambia el color de fondo a blanco
  }
}

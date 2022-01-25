// Localitzem l'element canvas del html
const canvas = document.querySelector('#canvas');
// Instanciem un canvas de dues dimensions
const ctx = canvas.getContext('2d');

// Guardem els sons en aquestes variables
const pong_paddle = document.querySelector("#pong_paddle");
const pong_wall = document.querySelector("#pong_wall");
const pong_score = document.querySelector("#pong_score");
const pong_victoria = document.querySelector("#pong_victoria");

// Aquestes són variables extra per a la mesura del canvas
const netWidth = 4;
const netHeight = canvas.height;

// -- Guarden les mesures de les pales --

// Amplada de les pales
const paddleWidth = 10;
// Llargada de les pales
const paddleHeight = 100;

// Les següents variables són per activar els events de teclat, i per defecte tenen el valor de false

// Per la tecla de reinici
let restart = false;

// Per les tecles de la pala 1
let upArrowPressed = false;
let downArrowPressed = false;

// Per les tecles de la pala 2
let upArrowPressed2 = false;
let downArrowPressed2 = false;

// -- Utilitzem constants per definir l'aparença dels objectes que es dibuixen en un canvas --

// Marcador
const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "white"
};

// Pala 1
const paddle1 = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: 'red',
  score: 0
};

// Pala 2
const paddle2 = {
  x: canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: 'blue',
  score: 0
};

// Bola
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 4,
  velocityX: 5,
  velocityY: 5,
  color: '#FFC107'
};

// Missatge de victòria
const victoria = {
  x: canvas.width / 2 - netWidth / 2,
  y: 160,
  width: netWidth,
  height: netHeight
};

// Missatge d'instruccions
const instruccio = {
  x: canvas.width / 2 - netWidth / 2,
  y: 320,
  width: netWidth,
  height: netHeight,
  color: "#FFC107"
};

// -- Funcions de dibuix --

// Per dibuixar el marcador
function drawNet() {
  // Color de lletra
  ctx.fillStyle = net.color;
  // Ombra
  ctx.shadowColor = net.color;
  // S'escriu el text
  ctx.fillRect(net.x, net.y, net.width, net.height);
}

// Es dissenya la puntuació del marcador
function drawScore(x, y, score) {
  // Color de lletra
  ctx.fillStyle = 'white';
  // Estil de font
  ctx.font = '35px arcade';
  // S'escriu el text
  ctx.fillText(score, x, y);
}

// Es dissenyen les pales
function drawPaddle(x, y, width, height, color) {
  // Color de les pales
  ctx.fillStyle = color;
  // Color d'ombra
  ctx.shadowColor = color;
  // Mesura X de l'ombra
  ctx.shadowOffsetX = 1;
  // Mesura Y de l'ombra
  ctx.shadowOffsetY = 1;
  // Mesura de l'efecte d'ombra
  ctx.shadowBlur = 10;
  // Es dibuixen les figures
  ctx.fillRect(x, y, width, height);
}

// Es dissenya la bola
function drawBall(x, y, radius, color) {
  // Color de la bola
  ctx.fillStyle = color;
  // Configuració d'ombra
  ctx.shadowColor = color;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 10;
  // Començament del dibuix
  ctx.beginPath();
  // Càlcul de la seva figura
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  // Final del dibuix
  ctx.closePath();
  // Es pinta la bola
  ctx.fill();
}

// -- Events de teclat --

// Si es pressiona una tecla
window.addEventListener('keydown', keyDownHandler);
// Si es deixa de pressionar una tecla
window.addEventListener('keyup', keyUpHandler);

// Quan s'ha pressionat una tecla
function keyDownHandler(event) {
  // Es recull el codi de teclat corresponent a l'event
  switch (event.keyCode) {
    // -- Si un dels següents casos és correcte, la seva variable d'estat retornarà true --

    // Tecla d'espai per a reiniciar el joc
    case 32:
      restart = true;
      break;

    // -- Controls de la pala 1 --

    // Tecla 'w' per moure's cap a dalt
    case 87:
      upArrowPressed = true;
      break;
    // Tecla 's' per moure's cap abaix
    case 83:
      downArrowPressed = true;
      break;

    // -- Controls de la pala 2 --

    // Tecla de la fletxa superior per moure's cap a dalt
    case 38:
      upArrowPressed2 = true;
      break;
    // Tecla de la fletxa inferior per moure's cap abaix
    case 40:
      downArrowPressed2 = true;
      break;
  }
}

// Quan s'ha deixat anar una tecla anteriorment pulsada es desactiven les funcions que es truquen per teclat
function keyUpHandler(event) {
  switch (event.keyCode) {
    // Tecla de reinici
    case 32:
      restart = false;
      break;

    // -- Controls de la pala 1 --

    // Tecla 'w' per moure's cap a dalt
    case 87:
      upArrowPressed = false;
      break;
    // Tecla 's' per moure's cap abaix
    case 83:
      downArrowPressed = false;
      break;

    // -- Controls de la pala 2 --

    // Tecla de la fletxa superior per moure's cap a dalt
    case 38:
      upArrowPressed2 = false;
      break;
    // Tecla de la fletxa inferior per moure's cap abaix
    case 40:
      downArrowPressed2 = false;
      break;
  }
}

// Es reseteja la posició de la bola
function resetejarBola() {
  // Direccions de la bola
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  // Velocitat de la bola
  ball.speed = 6;

  // Es canvien les direccions de la bola, reduïnt la seva velocitat
  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
}

// Quan es detecta una colisió
function colisioDetectada(player, ball) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.responseText == 1) {
        // Es detecta si la bola a chocat contra una de les pales
        player.top = player.y;
        player.right = player.x + player.width;
        player.bottom = player.y + player.height;
        player.left = player.x;

        // Es modifica la direcció de la bola després de chocar
        ball.top = ball.y - ball.radius;
        ball.right = ball.x + ball.radius;
        ball.bottom = ball.y + ball.radius;
        ball.left = ball.x - ball.radius;

        // Es retornen les coordenades actualitzades de la bola
        return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
        // Per actualitzar les posicions canviades dels elements
      }
    }
  }
  xhr.open("post","respostes.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.send("pregunta="+n_preg+"&resposta="+resposta);
}
    
  function update() {
  // Mou la pala 1
  if (upArrowPressed && paddle1.y > 0) {
    // Es mou la pala cap adalt
    paddle1.y -= 8;
  } else if (downArrowPressed && (paddle1.y < canvas.height - paddle1.height)) {
    // Es mou la pala cap abaix
    paddle1.y += 8;
  }

  // Mou la pala2
  if (upArrowPressed2 && paddle2.y > 0) {
    // Es mou la pala cap adalt
    paddle2.y -= 8;
  } else if (downArrowPressed2 && (paddle2.y < canvas.height - paddle2.height)) {
    // Es mou la pala cap abaix
    paddle2.y += 8;
  }

  // Comprova si la bola ha rebotat contra la paret superior o la inferior
  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
    // Es reprodueix el so de chocar la bola contra una paret
    pong_wall.play();
    // Es redueix la velocitat de la bola
    ball.velocityY = -ball.velocityY;
  }
  
  // Si la bola toca el mur dret
  if (ball.x + ball.radius >= canvas.width) {
    // Es suma un punt per al jugador 1
    paddle1.score++;
    // La bola torna al seu estat inicial
    resetejarBola();  
    // Si el jugador 1 té 10 punts
    if(paddle1.score == 10) {
      // Es reprodueix un audio per indicar la seva victòria
      pong_victoria.play();
    } else {
      // En cas contrari s'executarà un altre audio per indicar que s'ha marcat un punt
      pong_score.play();
    }
  }

  // Si la bola toca la paret esquerra
  if (ball.x - ball.radius <= 0) {
    // Es suma un punt al jugador 2
    paddle2.score++;
    // Es reseteja la bola
    resetejarBola();
    // Si el jugador 2 aconsegueix 10 punts
    if(paddle2.score == 10) {
      // Es reprodueix un audio per indicar la seva victòria
      pong_victoria.play();
    } else {
      // En cas contrari s'executarà un altre audio per indicar que s'ha marcat un punt
      pong_score.play();
    }
  }
 
  // Es mou la bola d'acord amb la velocitat que li hem assignat
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Si es detecta una colisió amb una de les pales
  let player = (ball.x < canvas.width / 2) ? paddle1 : paddle2;

  if (colisioDetectada(player, ball)) {
    // S'executa un audio per quan la bola reboti contra les pales
    pong_paddle.play();

    // Angle per recalcular la direcció de la bola quan choqui
    let angle = 0;

    // Si la bola toca a la part superior d'una pala
    if (ball.y < (player.y + player.height / 2)) {
      // Es recalcula la direcció per anar cap a baix
      angle = -1 * Math.PI / 4;
    } else if (ball.y > (player.y + player.height / 2)) {
      // Si rebota contra la part inferior de la pala
      // Es fa que la bola vagi cap abaix
      angle = Math.PI / 4;
    }

    // Es canvia la velocitat de la bola en funció de a quina pala ha rebotat la bola

    // Si ha rebotat contra la pala 1
    ball.velocityX = (player === paddle1 ? 1 : -1) * ball.speed * Math.cos(angle);
    // Si ha rebotat contra la pala 2
    ball.velocityY = ball.speed * Math.sin(angle);

    // S'incrementa la velocitat de la bola
    ball.speed += 0.2;
  }
}

// Aquesta funció ho dibuixa tot al canvas
function render() {
  // El fons de la pantalla serà negre
  ctx.fillStyle = "black";
  // Es dibuixa la pantalla
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Es dibuixa el marcador
  drawNet();
  // Es dibuixa la puntuació del jugador 1
  drawScore(canvas.width / 4, canvas.height / 6, paddle1.score);
  // Es dibuixa la puntuació del jugador 2
  drawScore(3 * canvas.width / 4, canvas.height / 6, paddle2.score);
  // Es dibuixa la pala 1
  drawPaddle(paddle1.x, paddle1.y, paddle1.width, paddle1.height, paddle1.color);
  // Es dibuixa la pala 2
  drawPaddle(paddle2.x, paddle2.y, paddle2.width, paddle2.height, paddle2.color);
  // Es dibuixa la bola
  drawBall(ball.x, ball.y, ball.radius, ball.color);
}

// Dissenyem un missatge de victòria, en cas que un dels jugadors guanyi
function drawVictoria(guanyador, color, x, y) {
  // Definim el fons
  ctx.color = color;
  // S'escull el color de la lletra
  ctx.fillStyle = color;
  // Configurem les ombres del text que hi haurà al missatge
  ctx.shadowColor = color;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.shadowBlur = 10;
  // Assignem l'estil de font
  ctx.font = '30px arcade';
  // Introduïm el text a la pantalla
  ctx.fillText(guanyador, x, y);
}

// També dissenyem una línia d'instruccions, que quan hi hagi un guanyador indicarà que es pot començar una nova partida si es pressiona la tecla d'espai
function drawInstruccio(x, y) {
  // El color de la lletra serà daurat
  ctx.fillStyle = '#FFC107';
  // I la seva ombra també serà daurada
  ctx.shadowColor = "#FFC107";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  // Es defineix l'estil del text
  ctx.font = '18px arcade';
  // Introduim el missatge que volem mostrar
  ctx.fillText("Pressiona ESPAI per tornar a jugar.", x, y);
}

// Es dibuixa la pantalla de victòria juntament amb les instruccions
function renderVictoria(guanyador, color) {
  // Els fons serà negre
  ctx.fillStyle = "black";
  // El text de la pantalla estarà centrat
  ctx.textAlign = "center";
  // Es dibuixen els elements esmentats anteriorment
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawVictoria(guanyador, color, victoria.x, victoria.y);
  drawInstruccio(instruccio.x, instruccio.y);
}

// Es carrega el joc
function gameLoop() {
  // Si s'ha pulsat la tecla d'espai la puntuació es reseteja
  if(restart) {
      paddle1.score = 0;
      paddle2.score = 0;
      restart = false;
  } 

  let guanyador;

  // Si el jugador 1 ha marcat 10 punts
  if(paddle1.score == 10) {
    // Escrivim la felicitació per al jugador
    guanyador = "Has guanyat, jugador vermell.";
    // Carreguem la funció per executar la pantalla de victòria
    renderVictoria(guanyador, color = "red");
  } else if(paddle2.score == 10) {
    // En cas que el jugador 2 hagi guanyat, s'imprimeix aquest missatge
    guanyador = "Has guanyat, jugador blau.";
    // Carreguem la funció per canviar la pantalla
    renderVictoria(guanyador, color = "blue");
  } else {
    // Si no hi ha guanyador s'actualitza la pantalla constantment
    update();
    // Es renderitzen els elements que s'utilitzaràn en una partida de pong
    render();
  }
}

// Truquem la funció del gameLoop 60 vegades per segon
setInterval(gameLoop, 1000 / 60);
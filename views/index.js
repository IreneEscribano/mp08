var express = require('express'), app = new express();

// Inici

app.get('/', function(req, res){
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/index.html');
});

// CSS

app.get('/assets/css/style.css', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/css/style.css');
});

// JavaScript

app.get('/assets/js/script.js', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/js/script.js');
});

// Fons

app.get('/assets/images/background.jpg', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/images/background.jpg');
});

// Fons de la màquina

app.get('/assets/images/fons.jpg', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/images/fons.jpg');
});

// Font tipogràfica de la màquina

app.get('/assets/fonts/pong.ttf', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/fonts/pong.ttf');
});

// Font tipogràfica de l'interior de la màquina

app.get('/assets/fonts/arcade.ttf', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/fonts/arcade.ttf');
});

// Per poder utilitzar els audios
app.use('/mp3', express.static(__dirname + '/mp3'));

// Soroll de la pala

app.get('/assets/sounds/pong_paddle.mp3', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/sounds/pong_paddle.mp3');
});

// So del mur

app.get('/assets/sounds/pong_wall.mp3', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/sounds/pong_wall.mp3');
});

// So de la puntuació

app.get('/assets/sounds/pong_score.mp3', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/sounds/pong_score.mp3');
});

// Música de victoria

app.get('/assets/sounds/pong_victoria.mp3', function(req, res) {
  res.sendFile('/var/www/html/daw2-irenee/web/mp07/pong_web/assets/sounds/pong_victoria.mp3');
});

var server = app.listen(8000,function() {});
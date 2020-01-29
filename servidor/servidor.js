//paquetes necesarios para el proyecto
var express = require('express');
var controler = require('../servidor/controladores/controler');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/peliculas', controler.peliculas );
app.get('/peliculas/recomendacion', controler.recomendacion );
app.get('/peliculas/:id', controler.pelicula );
app.get('/generos', controler.generos );

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});


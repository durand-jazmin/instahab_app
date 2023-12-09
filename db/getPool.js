var dotenv = require('dotenv');
var mysql = require('mysql2/promise');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

var MYSQL_HOST = process.env.MYSQL_HOST;
var MYSQL_USER = process.env.MYSQL_USER;
var MYSQL_PASS = process.env.MYSQL_PASSWORD;
var MYSQL_DB = process.env.MYSQL_DATABASE;

function createDatabase() {
  mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
  }).then(function(connection) {
    // Crear la base de datos si no existe
    connection.query('CREATE DATABASE IF NOT EXISTS ' + MYSQL_DB)
      .then(function() {
        console.log('Base de datos "' + MYSQL_DB + '" creada correctamente.');
        connection.end(); // Cerrar la conexión
      })
      .catch(function(error) {
        console.error('Error al crear la base de datos:', error);
      });
  }).catch(function(error) {
    console.error('Error al conectar a MySQL:', error);
  });
}

// Llamar a la función para crear la base de datos
createDatabase();
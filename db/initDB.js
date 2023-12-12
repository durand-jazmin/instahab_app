var dotenv = require('dotenv');
var mysql = require('mysql2/promise');
var fs = require('fs');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

async function createTable() {
  try {
    // Obtener datos de las variables de entorno
   var MYSQL_HOST = process.env.MYSQL_HOST;
   var MYSQL_USER = process.env.MYSQL_USER;
   var MYSQL_PASS = process.env.MYSQL_PASSWORD;
   var MYSQL_DB = process.env.MYSQL_DATABASE;

    // Crear la conexión a la base de datos
    const connection = await mysql.createConnection({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASS,
      database: MYSQL_DB,
    });


    // Consulta SQL para crear la tabla 'users'
    const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Consulta SQL para crear la tabla 'posts'
    const createPostsTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        text VARCHAR(280) NOT NULL,
        image VARCHAR(100),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;

    // Consulta SQL para crear la tabla 'likes'
    const createLikesTableQuery = `
      CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNSIGNED NOT NULL,
        post_id INT UNSIGNED NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
      )
    `;

// Consulta SQL para crear la tabla 'comments'
const createCommentsTableQuery = `
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    post_id INT UNSIGNED NOT NULL,
    comment_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
  )
`;


    // Ejecutar las consultas para crear las tablas
    await connection.query(createUserTableQuery);
    console.log('Tabla "users" creada correctamente.');

    await connection.query(createPostsTableQuery);
    console.log('Tabla "posts" creada correctamente.');

    await connection.query(createLikesTableQuery);
    console.log('Tabla "likes" creada correctamente.');

    await connection.query(createCommentsTableQuery);
    console.log('Tabla "comments" creada correctamente.');

    connection.end(); // Cerrar la conexión
  } catch (error) {
    console.error('Error al crear las tablas:', error);
  }
}

// Llamar a la función para crear las tablas
createTable();

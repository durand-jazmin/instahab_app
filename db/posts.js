const bcrypt = require('bcrypt');
const { generateError,createPathIfNotExists } = require('../helpers');
const fs = require('fs');
const path = require('path');
const { getConnection } = require('./getPool');

const detelePostById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    await connection.query(
      `
      DELETE FROM posts WHERE id = ?
    `,
      [id]
    );

    return;
  } finally {
    if (connection) connection.release();
  }
};

const getPostById = async (id) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT * FROM posts WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      throw generateError(`El post con id: ${id} no existe`, 404);
    }

    return result[0];
  } finally {
    if (connection) connection.release();
  }
};

const getAllPosts = async () => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(`
      SELECT * FROM posts ORDER BY created_at DESC
    `);

    return result;
  } finally {
    if (connection) connection.release();
  }
};

var createPost = async function(userId, text, image) {
  var connection;

  if (!userId || !text || !image) {
    throw new Error('El ID de usuario, el texto y la imagen son obligatorios');
  }

  if (text.length > 100) {
    throw new Error('El texto debe tener menos de 100 caracteres');
  }

  try {
    connection = await getConnection();

    var userExists = await checkUserExists(userId); // Verificar si el usuario existe

    if (!userExists) {
      throw new Error('El usuario no está registrado');
    }

    var result = await connection.query(
      'INSERT INTO posts (user_id, text, image) VALUES (?, ?, ?)',
      [userId, text, image]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  detelePostById,
};

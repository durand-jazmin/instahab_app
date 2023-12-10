const { generateError } = require('../helpers');
const { getConnection } = require('./getPool');

const addLikeToPost = async (postId, userId) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      // Añadir un nuevo like a la tabla 'likes'
      await connection.query(
        `
        INSERT INTO likes (user_id, post_id)
        VALUES (?, ?)
      `,
        [userId, postId]
      );
  
      // Incrementar el contador de likes en la tabla 'posts'
      await connection.query(
        `
        UPDATE posts
        SET likes = likes + 1
        WHERE id = ?
      `,
        [postId]
      );
  
      return;
    } finally {
      if (connection) connection.release();
    }
  };
  
  const removeLikeFromPost = async (postId, userId) => {
    let connection;
  
    try {
      connection = await getConnection();
  
      // Eliminar el like de la tabla 'likes'
      await connection.query(
        `
        DELETE FROM likes
        WHERE user_id = ? AND post_id = ?
      `,
        [userId, postId]
      );
  
      // Decrementar el contador de likes en la tabla 'posts'
      await connection.query(
        `
        UPDATE posts
        SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END
        WHERE id = ?
      `,
        [postId]
      );
  
      return;
    } finally {
      if (connection) connection.release();
    }
  };
  
  module.exports = {
       addLikeToPost, 
    removeLikeFromPost
  };
  
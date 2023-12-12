const { generateError } = require('../helpers');
const { getConnection } = require('./getPool');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const addCommentToPost = async (postId, userId, commentText) => {
    let connection;
  
    try {
        connection = await getConnection();
  
        // Añadir un nuevo comentario a la tabla 'comments'
        await connection.query(
            `
            INSERT INTO comments (user_id, post_id, comment_text)
            VALUES (?, ?, ?)
            `,
            [userId, postId, commentText]
        );
  
        // Incrementar el contador de comentarios en la tabla 'posts'
        await connection.query(
            `
            UPDATE posts
            SET comments = comments + 1
            WHERE id = ?
            `,
            [postId]
        );
  
        return;
    } finally {
        if (connection) connection.release();
    }
};
  
const removeCommentFromPost = async (postId, commentId) => {
    let connection;
  
    try {
        connection = await getConnection();
  
        // Eliminar el comentario de la tabla 'comments'
        await connection.query(
            `
            DELETE FROM comments
            WHERE id = ? AND post_id = ?
            `,
            [commentId, postId]
        );
  
        // Decrementar el contador de comentarios en la tabla 'posts'
        await connection.query(
            `
            UPDATE posts
            SET comments = CASE WHEN comments > 0 THEN comments - 1 ELSE 0 END
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
    addCommentToPost,
    removeCommentFromPost
};

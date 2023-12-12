const bcrypt = require('bcrypt');
const fs = require('fs');
const { getConnection } = require('./getPool');
  const { generateError, createPathIfNotExists } = require('../helpers');
  const path = require('path');
  const sharp = require('sharp');
  const { nanoid } = require('nanoid');

const {
    addLikeController,
    removeLikeController
  } = require('../db/posts');

  const addCommentController = (req, res) => {
    const { post_id, comment_text } = req.body;
    const user_id = req.user.id;   
    const addCommentQuery = `
      INSERT INTO comments (user_id, post_id, comment_text) VALUES (?, ?, ?)
    `;
  
    db.query(addCommentQuery, [user_id, post_id, comment_text], (err, result) => {
      if (err) {
        console.error('Error al agregar el comentario:', err);
        res.status(500).json({ error: 'No se pudo agregar el comentario' });
        return;
      }
      res.status(200).json({ message: 'Comentario agregado exitosamente' });
    });
  };

  
  const removeCommentController = (req, res) => {
    const { comment_id } = req.body;
    const user_id = req.user.id; 
  
    const removeCommentQuery = `
      DELETE FROM comments WHERE id = ? AND user_id = ?
    `;
  
    db.query(removeCommentQuery, [comment_id, user_id], (err, result) => {
      if (err) {
        console.error('Error al quitar el comentario:', err);
        res.status(500).json({ error: 'No se pudo quitar el comentario' });
        return;
      }
      res.status(200).json({ message: 'Comentario eliminado exitosamente' });
    });
  };
  
const {
    addLikeController,
    removeLikeController
  } = require('../db/posts');
  const { generateError, createPathIfNotExists } = require('../helpers');
  const path = require('path');
  const sharp = require('sharp');
  const { nanoid } = require('nanoid');
  

// Controlador para agregar un like a un post
const addLikeController = (req, res) => {
  const { post_id } = req.body;
  const user_id = req.user.id; 

  const addLikeQuery = `
    INSERT INTO likes (user_id, post_id) VALUES (?, ?)
  `;

  db.query(addLikeQuery, [user_id, post_id], (err, result) => {
    if (err) {
      console.error('Error al agregar el like:', err);
      res.status(500).json({ error: 'No se pudo agregar el like' });
      return;
    }
    res.status(200).json({ message: 'Like agregado exitosamente' });
  });
};

// Controlador para quitar un like de un post
const removeLikeController = (req, res) => {
  const { post_id } = req.body;
  const user_id = req.user.id; 

  const removeLikeQuery = `
    DELETE FROM likes WHERE user_id = ? AND post_id = ?
  `;

  db.query(removeLikeQuery, [user_id, post_id], (err, result) => {
    if (err) {
      console.error('Error al quitar el like:', err);
      res.status(500).json({ error: 'No se pudo quitar el like' });
      return;
    }
    res.status(200).json({ message: 'Like quitado exitosamente' });
  });
};

module.exports = { addLikeController, removeLikeController };
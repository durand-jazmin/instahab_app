const bcrypt = require('bcrypt');
const { generateError,createPathIfNotExists } = require('../helpers');
const fs = require('fs');
const { getConnection } = require('../db/getPool');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');

const {
  createPost,
  getAllPosts,
  getPostById,
  deletePostById,
} = require('../db/posts');





const getAllPostsController = async (req, res, next) => {
  try {
    const posts = await getAllPosts();

    res.send({
      status: 'ok',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};


const createPostController = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.length > 100) {
      throw generateError(
        'El texto del post debe existir y ser de menos de 100 caracteres',
        400
      );
    }

    let imageFileName;

    // Verificar si hay una imagen adjunta
    if (!req.files || !req.files.image) {
      throw generateError('La imagen del post es obligatoria', 400);
    }

    // Crear el path del directorio uploads
    const uploadsDir = path.join(__dirname, '../uploads');

    // Crear el directorio si no existe
    await createPathIfNotExists(uploadsDir);

    // Procesar la imagen
    const image = sharp(req.files.image.data);
    image.resize(1000);

    // Guardar la imagen con un nombre aleatorio en el directorio uploads
    imageFileName = `${nanoid(24)}.jpg`;

    await image.toFile(path.join(uploadsDir, imageFileName));

    const id = await createPost(req.userId, text, imageFileName);

    res.send({
      status: 'ok',
      message: `Post con id: ${id} creado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

const getSinglePostController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);

    res.send({
      status: 'ok',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await getPostById(id);

    if (req.userId !== post.user_id) {
      throw generateError(
        'Estás intentando borrar un post que no es tuyo',
        401
      );
    }

    await deletePostById(id);

    res.send({
      status: 'ok',
      message: `El post con id: ${id} fue borrado`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPostsController,
  createPostController,
  getSinglePostController,
  deletePostController,
};

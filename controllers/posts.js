const {
    createPost,
    getAllPosts,
    getPostById,
    deletePostById,
  } = require('../db/posts');
  const { generateError, createPathIfNotExists } = require('../helpers');
  const path = require('path');
  const sharp = require('sharp');
  const { nanoid } = require('nanoid');
  
  const getPostsController = async (req, res, next) => {
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
 
  const newController = async (req, res, next) => {
    try {
      const { text } = req.body;
  
      if (text && text.length > 100) {
        throw generateError(
          'El texto debe ser menor de 100 caracteres',
          400
        );
      }
      let imageFileName;
  
      if (!req.files || !req.files.image) {
        throw generateError('Se requiere una imagen para el post', 400);
        }
        // Si hay una imagen adjunta en la solicitud, proceder con su procesamiento
        const resultDir = path.join(__dirname, '../resultDir');
  
        // Creo el directorio si no existe
        await createPathIfNotExists(resultDir);
  
        // Procesar la imagen
        const image = sharp(req.files.image.data);
        //image.resize(1000);
  
        // Guardo la imagen con un nombre aleatorio en el directorio resultDir
        imageFileName = `${nanoid(24)}.jpg`;
  
        await image.toFile(path.join(resultDir, imageFileName));
      
  
      const id = await createPost(req.userId, text, imageFileName);

      //confirmo que el post esta creado
  
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
      const tweet = await getPostById(id);
  
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
      //req.userId
      const { id } = req.params;
  
      // Conseguir la información del tweet que quiero borrar
      const post = await getPostById(id);
  
      // Comprobar que el usuario del token es el mismo que creó el post
      if (req.userId !== post.user_id) {
        throw generateError(
          'Estás intentando borrar un post que no es tuyo',
          401
        );
      }
  
      // Borrar el post
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
    getPostsController,
    newPostController,
    getSinglePostController,
    deletePostController,
  };
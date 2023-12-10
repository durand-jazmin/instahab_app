const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const { createUser, getUserById, getUserByEmail } = require('../db/users');
//const { createAnonymousUser } = require('../db/anonymoususer'); 
//const { addLikeController, removeLikeController } = require('../controllers/likes');
const newUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const Joi = require('joi');

    // Definir el esquema de validación con Joi
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    
    // Validar la solicitud con el esquema
    const { error } = schema.validate(req.body);
    
    if (error) {
      // Si hay un error de validación, se lanza un error con el mensaje detallado
      throw generateError(error.details[0].message, 400);
    }
    

    const id = await createUser(email, password);

    res.send({
      status: 'ok',
      message: `User created with id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    // Obtener el usuario por email
    const user = await getUserByEmail(email);

    // Si el usuario no está autenticado (es decir, tiene un ID generado por UUID)
    if (!user.authenticated) {
      const authenticatedUserId = generateAuthenticatedUserId(); // Generar ID autenticado

      // Actualizar el ID del usuario a uno autenticado
      await updateUserId(user.id, authenticatedUserId);

      res.send({
        status: 'ok',
        data: { authenticatedUserId }, // Devolver el nuevo ID autenticado
      });
    } else {
      // El usuario ya está autenticado, generar token JWT normalmente
      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '30d' });

    /*if (!email || !password) {
      throw generateError('Debes enviar un email y una password', 400);
    }
    const user = await getUserByEmail(email);

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError('La contraseña no coincide', 401);*/
    }

    res.send({
      status: 'ok',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

 //Controlador para crear un usuario anónimo
const createAnonymousUserController = async (req, res, next) => {
  try {
    const user = await createAnonymousUser(); // Utiliza la función para crear usuario anónimo

    res.send({
      status: 'ok',
      message: 'Anonymous user created',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  newUserController,
  getUserController,
  loginController,
  //createAnonymousUserController,
  
};
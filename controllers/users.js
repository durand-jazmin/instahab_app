const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');
const { createUser, getUserById, getUserByEmail } = require('../db/users');
//const { createAnonymousUser } = require('../db/anonymoususer'); 

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

    if (!email || !password) {
      throw generateError('Debes enviar un email y una password', 400);
    }

    // Recojo los datos de la base de datos del usuario con ese mail
    const user = await getUserByEmail(email);

    // Compruebo que las contraseñas coinciden
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError('La contraseña no coincide', 401);
    }

    // Creo el payload del token
    const payload = { id: user.id };

    // Firmo el token
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '30d',
    });

    // Envío el token
    res.send({
      status: 'ok',
      data: token,
    });
  } catch (error) {
    next(error);
  }
};

/* Controlador para crear un usuario anónimo
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
};*/



module.exports = {
  newUserController,
  getUserController,
  loginController,
  //createAnonymousUserController,
  
};
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const {
  newUserController,
  getUserController,
  loginController,
} = require('./controllers/users');

const {
  getPostsController,
  newPostController,
  getSinglePostController,
  deletePostController,
} = require('./controllers/posts');

const { authUser } = require('./middlewares/auth');

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));

//Rutas de usuario
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);

//Rutas de posts
app.post('/post', authUser, newPostController);
app.get('/post', getPostsController);
app.get('/post/:id', getSinglePostController);
app.delete('/post/:id', authUser, deletePostController);

// Verificar si es un usuario anónimo
const authenticateAnonymousUser = (req, res, next) => {
  // Puedes acceder al email desde donde sea que esté almacenado en la solicitud

  const { email } = req.body; 
  if (email.startsWith('anonymous_')) {
    // Si es un usuario anónimo, puedes seguir con la ejecución
    next();
  } else {
    // Si no es un usuario anónimo, devolver un error de autenticación
    res.status(401).send({
      status: 'error',
      message: 'Not authorized as anonymous user',
    });
  }
};



// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

// Lanzamos el servidor
app.listen(3000, () => {
  console.log('Servidor funcionando!');
});


// Uso del middleware en una ruta específica
app.get('/route-for-anonymous-users-only', authenticateAnonymousUser, (req, res) => {
  // Esta parte del código se ejecutará solo si el usuario es anónimo
  res.send('Acceso permitido para usuarios anónimos');
});
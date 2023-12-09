const fs = require("fs/promises");

//función que comprueba que una ruta existe en disco
async function pathExists(path) {
  try {
    await fs.access(path);
  } catch {
    throw new Error(`La ruta ${path} no existe`);
  }
}

//función que crea una ruta en disco si no existe
async function createPathIfNotExists(path) {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path);
  }
}

module.exports = {
  pathExists,
  createPathIfNotExists,
};

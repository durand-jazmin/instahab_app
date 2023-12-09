const minimist = require("minimist");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs/promises");
const sharp = require("sharp");

const { pathExists, createPathIfNotExists } = require("./helpers");

console.log(chalk.green(`Welcome to INSTAHAB APP v1.0`));
console.log();

//Esta función hace el trabajo de procesado
async function processImages({ imagesDir, resultDir, watermark, resize }) {
  try {
    const inputPath = path.resolve(__dirname, imagesDir);
    const outputPath = path.resolve(__dirname, resultDir);
    let watermarkPath;

    if (watermark) {
      watermarkPath = path.resolve(__dirname, watermark);
    }

    //Comprobar que imagesDir existe
    await pathExists(inputPath);

    //Crear si no existe outputDir
    await createPathIfNotExists(outputPath);

    //Si existe watermark colocar comprobar que el archivo watermark existe
    if (watermarkPath) {
      await pathExists(watermarkPath);
    }

    //Leer los archivos de inputPath
    const inputFiles = await fs.readdir(inputPath);

    //Quedarme solo con los archivos que sean imágenes
    const imageFiles = inputFiles.filter((file) => {
      const validExtensions = [".jpg", ".jpeg", ".gif", ".png", ".webp"];

      return validExtensions.includes(path.extname(file).toLowerCase());
    });

    //Recorrer toda la lista de archivos y:
    // - Si existe "resize" redimensionar cada una de las imágenes
    // - Si existe "watermark" colocar el watermark en la parte inferior derecha de la imagen
    // - Guardar la imágen resultante en resultDir

    for (const imageFile of imageFiles) {
      console.log(chalk.blue(`Procesando imagen: ${imageFile}`));
      //Creamos la ruta completa de la imagen
      const imagePath = path.resolve(inputPath, imageFile);

      //Cargamos la imagen en sharp
      const image = sharp(imagePath);

      //Si existe resize hacemos el resize
      if (resize) {
        image.resize(resize);
      }

      //Si existe watermarkPath colocamos el watermark

      if (watermarkPath) {
        image.composite([
          {
            input: watermarkPath,
            top: 5,
            left: 5,
          },
        ]);
      }

      //Guardamos la imagen con otro nombre en outputPath
      await image.toFile(path.resolve(outputPath, `post_${imageFile}`));

      console.log();
      console.log(
        chalk.green(
          `Todo finalizado, tus imágenes están en el directorio ${resultDir}`
        )
      );
    }
  } catch (error) {
    console.error(chalk.red(error.message));
    console.error(chalk.red("Comprueba que los argumentos sean correctos!"));
    process.exit(1);
  }
}

//Proceso los argumentos
const args = minimist(process.argv.slice(2));
const { imagesDir, resultDir, watermark, resize } = args;

//Si no existe imagesDir o resultDir muestro error y salgo del programa
if (!imagesDir || !resultDir) {
  console.error(
    chalk.red("Los argumentos --imagesDir y --resultDir son obligatorios")
  );
  process.exit(1);
}

//Si no existe watermark y no existe resize muestro error y salgo del programa
if (!watermark && !resize) {
  console.error(
    chalk.red("Es necesario que exista un argumento --watermark o --resize")
  );
  process.exit(1);
}

//Todos los argumentos están correctos, seguimos
console.log(chalk.green("Procesando imágenes..."));
console.log();

processImages({ imagesDir, resultDir, watermark, resize });

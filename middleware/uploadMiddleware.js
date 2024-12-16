import cloudinary from "../config/cloudinary.js";
import multer from "multer";

// Configurar Multer para procesar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para subir archivos a Cloudinary
export const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next(); // Si no hay archivo, pasa al siguiente middleware
  }

  try {
    // Inicia el upload a Cloudinary
    const uploadedResponse = cloudinary.uploader.upload_stream(
      {
        folder: "social-app", // Carpeta donde se almacenarán los archivos en Cloudinary
      },
      (error, result) => {
        if (error) {
          return next(error); // Si hay error, pasa el error al siguiente middleware
        }

        // Añade la URL de la imagen a la solicitud (req) para que pueda ser usada posteriormente
        req.uploadedFile = result;
        return next(); // Continuar con el siguiente middleware
      }
    );

    // Pasa el archivo de la solicitud a Cloudinary
    req.file.stream.pipe(uploadedResponse);
  } catch (error) {
    return next(error); // Si hay un error en el middleware, lo pasa
  }
};

export default upload;

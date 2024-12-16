import cloudinary from "../config/cloudinary.js";
import multer from "multer";
console.log("cloudinary", cloudinary);

// Configurar Multer para procesar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para subir archivos a Cloudinary
export const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const uploadedResponse = await cloudinary.uploader.upload_stream(
      {
        folder: "social-app",
      },
      async (error, result) => {
        if (result) {
          req.uploadedFile = result;
          return next();
        } else {
          return next(error);
        }
      }
    );

    req.file.stream.pipe(uploadedResponse);
  } catch (error) {
    return next(error);
  }
};

export default upload;

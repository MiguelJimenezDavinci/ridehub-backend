import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configurar Multer para procesar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para subir a Cloudinary
export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;

    // Subir el archivo a Cloudinary usando una Promesa
    const uploadToCloudinaryPromise = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ridehub" }, // Carpeta en Cloudinary
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        stream.end(fileBuffer); // Envía el archivo al stream
      });

    const result = await uploadToCloudinaryPromise();

    // Adjuntar la URL al cuerpo de la solicitud
    req.body.imageUrl = result.secure_url;
    console.log("Uploaded to Cloudinary:", result.secure_url);

    // Pasar al siguiente middleware
    next();
  } catch (err) {
    console.error("Upload middleware error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

export default upload;

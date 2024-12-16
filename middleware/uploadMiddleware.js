import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

// Usamos Multer para manejar archivos temporales
const storage = multer.diskStorage({
  destination: "temp/",
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Middleware de subida a Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se encontró ningún archivo." });
  }

  try {
    // Subir el archivo temporal a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ridehub", // Carpeta en Cloudinary
    });

    // Guardar la URL de la imagen en el cuerpo de la solicitud
    req.body.image = result.secure_url;

    // Eliminar el archivo temporal
    await fs.unlink(req.file.path);

    next();
  } catch (error) {
    console.error("Error al subir a Cloudinary:", error.message);
    return res
      .status(500)
      .json({ error: "Error al subir la imagen a Cloudinary" });
  }
};

export { upload, uploadToCloudinary };

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";

// Configurar Multer para procesar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileData = req.file;

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "ridehub" }, // Carpeta en tu cuenta de Cloudinary
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          return res
            .status(500)
            .json({ message: "Error uploading to Cloudinary" });
        }
        req.body.imageUrl = result.secure_url; // Guardar URL en el request
        next(); // Pasar al siguiente middleware
      }
    );

    // Stream para manejar el archivo
    const stream = result;
    stream.end(fileData.buffer);
    console.log("Uploaded to Cloudinary:", result.secure_url);
  } catch (err) {
    console.error("Upload middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default upload;

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const img_type = req?.body?.image_type;
    callback(null, path.join("images/", img_type));
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + ".png");
  },
});

const upload = multer({ storage });

export default upload;

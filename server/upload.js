import {GridFsStorage} from 'multer-gridfs-storage';
import multer from 'multer';

const storage = new GridFsStorage({
  url: "mongodb+srv://blogman:blogapp@blog-app.kyd6kpn.mongodb.net/?retryWrites=true&w=majority&appName=blog-app",
  options:{ useNewUrlparser: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpg"];

    if (match.indexOf(file.memeType) === -1) {
      return `${Date.now()}-blog-${file.originalname}`;
    }
    return {
      bucketName: "photos",
      fileName: `${Date.now()}-blog-${file.originalname}`,
    };
  },
});

export default multer({storage});
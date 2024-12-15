import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./additional_files/");
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split(".").pop();

    const fileName = `${req.body.name}.${fileExtension}` || file.originalname;

    cb(null, fileName);
  },
});

export const uploadFile = multer({ storage });

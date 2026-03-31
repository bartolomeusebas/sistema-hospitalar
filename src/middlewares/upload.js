const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const nome = Date.now() + ext;
        cb(null, nome);
    }
});

const upload = multer({ storage });

module.exports = upload;
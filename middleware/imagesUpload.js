const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "..", "public", "images"));
    },
    filename: (req, file, callback) => {
        const uniqueId = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        callback(null, file.fieldname + "-" + uniqueId + ext);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
        callback(null, true);
    } else {
        callback(new Error("Invalid file type"));
    }
};

const upload = multer({ storage, fileFilter });

//eksporter som objekt
module.exports = {upload};

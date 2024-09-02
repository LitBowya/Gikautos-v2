import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function fileFilter(req, file, cb) {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Images only!"), false);
    }
}

// Single image upload middleware
export const uploadSingleImage = multer({ storage, fileFilter }).single("image");

// Multiple images upload middleware
export const uploadMultipleImages = multer({ storage, fileFilter }).array(
    "images",
    10
); // 10 is the maximum number of files

// Route for single image upload
router.post("/single", (req, res) => {
    uploadSingleImage(req, res, function (err) {
        if (err) {
            return res.status(400).send({ status: 'Failed', message: err.message });
        }

        res.status(200).send({
            message: "Image uploaded successfully",
            image: `/${req.file.path}`,
        });
    });
});

// Route for multiple images upload
router.post("/multiple", (req, res) => {
    uploadMultipleImages(req, res, function (err) {
        if (err) {
            return res.status(400).send({ message: err.message });
        }

        const paths = req.files.map((file) => `/${file.path}`);
        res.status(200).send({
            message: "Images uploaded successfully",
            images: paths,
        });
    });
});

export default router;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.body.folderName || "misc";
    const safeFolder = folderName.replace(/[^a-z0-9_]/gi, "").toLowerCase();
    const fullPath = path.join("public", "images", "products", safeFolder);

    fs.mkdirSync(fullPath, { recursive: true });
    cb(null, fullPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[\s()]+/g, "_").toLowerCase();
    const uniqueName = Date.now() + "-" + safeBase + ext;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;

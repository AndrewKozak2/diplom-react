const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.post("/upload-screenshot", async (req, res) => {
  const { base64, filename } = req.body;

  if (!base64 || !filename) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const matches = base64.match(/^data:image\/png;base64,(.+)$/);
    if (!matches || matches.length !== 2) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    const buffer = Buffer.from(matches[1], "base64");

    const projectRoot = path.join(__dirname, "..", "..");
    const folderPath = path.join(projectRoot, "public", "images", "custom");
    const filePath = path.join(folderPath, filename);

    console.log("✅ Saving to:", filePath);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);
    return res.json({ path: `/images/custom/${filename}` });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return res.status(500).json({ error: "Failed to save image" });
  }
});

module.exports = router;

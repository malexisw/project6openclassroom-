// routes/sauce.js

const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controller/Sauces");
const multer = require("../middleware/multer-config");

router.get("/api/sauces", saucesCtrl.getAllSauces);

router.get("/api/sauces/:id", saucesCtrl.getOneSauces);

router.post("/api/sauces", multer, saucesCtrl.createSauces);

router.post("/api/sauces/:id/like", saucesCtrl.likedSauces);

router.put("/api/sauces/:id", multer, saucesCtrl.updateSauces);

router.delete("/api/sauces/:id", saucesCtrl.deleteSauces);

module.exports = router;

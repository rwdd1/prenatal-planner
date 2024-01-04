const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index");
const { ensureAuth } = require("../middleware/auth");

router.get("/", indexController.loadIndex);

module.exports = router;
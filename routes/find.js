const express = require("express");
const router = express.Router();
const findController = require("../controllers/find");
const { ensureAuth } = require("../middleware/auth");
const multer  = require('multer');
const upload = multer();

router.get("/", ensureAuth, findController.loadSearch);
router.post("/appointment", ensureAuth, findController.findAppointment);
router.post("/patient", ensureAuth, findController.findPatient);
router.put("/edit", [ensureAuth, upload.any()], findController.editAppointment);

module.exports = router;
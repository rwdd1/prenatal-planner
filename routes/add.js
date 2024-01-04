const express = require("express");
const router = express.Router();
const addController = require("../controllers/add");
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, addController.loadAdd);
router.post("/single", ensureAuth, addController.addSingleAppointment);
router.post("/multiple", ensureAuth, addController.addMultipleAppointments);

module.exports = router;
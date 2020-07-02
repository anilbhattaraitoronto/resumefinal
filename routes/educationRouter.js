const express = require("express");
const router = express.Router();
const educationController = require("../controllers/educationController");

router.get("/", educationController.getAllEducation);
router.post("/create", educationController.addNewEducation);
router.post("/update", educationController.updateEducation);
router.post("/delete", educationController.deleteEducation);

module.exports = router;

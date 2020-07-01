const express = require("express");
const router = express.Router();
const educationController = require("../controllers/educationController");

router.get("/", educationController.getAllEducation);
router.post("/create", educationController.addNewEducation);

module.exports = router;

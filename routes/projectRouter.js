const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.get("/", projectController.getAllProjects);
router.post("/create", projectController.createNewProject);
router.post("/update", projectController.updateProject);
router.post("/delete", projectController.deleteProject);

module.exports = router;

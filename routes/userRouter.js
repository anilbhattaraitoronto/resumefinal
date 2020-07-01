const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/addUser", userController.createUser);
router.post("/login", userController.logUsersIn);
router.get("/logout", userController.logUsersOut);
router.get("/profile/:username", userController.getUserProfile);

module.exports = router;

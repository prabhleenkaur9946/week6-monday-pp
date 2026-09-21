const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const { signupUser, loginUser, getMe } = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/me", requireAuth, getMe);

module.exports = router;
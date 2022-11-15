const express = require("express");
const { login, logout, register } = require("../controllers/authentication");
const router = express.Router();

/* POST user login*/
router.get("/login", (req, res) => {
  res.render("auth/login");
});
router.post("/login", login);

router.post("/logout", logout);

module.exports = router;

const express = require("express");
const { login, store, index } = require("../controllers/users");
const router = express.Router();

/* GET users listing. */
router.get("/", index);
/* RENDER create user page */
router.get("/create", (req, res) => {
  res.render("users/create");
});
/* POST create user*/
router.post("/", store);

module.exports = router;

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("sobrenos", { title: "Sobre nós" });
});

module.exports = router;
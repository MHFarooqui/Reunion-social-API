const router = require("express").Router();
const userRoutes = require("./users");
const postRouttes = require("./posts")
const commentRoutes = require("./comments")


router.use(userRoutes);
router.use(postRouttes);
router.use(commentRoutes);


module.exports = router;
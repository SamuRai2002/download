const router = require("express").Router();
const video = require("../controllers/videos");

router.get("/", video.getAll);
router.get("/:id", video.get);
router.post("/", video.create);
router.post("/single", video.createSingle);
router.patch("/:id", video.update);
router.delete("/:id", video.delete);

module.exports = router;

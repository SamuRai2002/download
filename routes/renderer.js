const router = require("express").Router();
const renderer = require("../controllers/renderer");

router.get("/latest", renderer.latestAll);
router.get("/latest/:id", renderer.singleVideo);

router.get("/trend", renderer.trend);
router.get("/trend/:id", renderer.singleVideo);

router.get("/stream", renderer.stream);
router.get("/stream/:id", renderer.singleStream);

router.get("/top", renderer.streamTop);
router.get("/top/:id", renderer.singleStream);

router.get("/animations", renderer.home);
router.get("/story", renderer.home);

router.get("/", renderer.home);

module.exports = router;

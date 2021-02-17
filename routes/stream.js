const router = require("express").Router();
const stream = require("../controllers/stream");

router.post("/", stream.create);

module.exports = router;

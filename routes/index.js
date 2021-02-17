const videoRouter = require("./videos");
const rendererRouter = require("./renderer");
const streamRouter = require("./stream");

module.exports = (app) => {
    app.use("/api/videos", videoRouter);
    app.use("/api/stream", streamRouter);
    app.use("/", rendererRouter);
};

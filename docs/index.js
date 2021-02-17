const main = require("./swagger.json");
const tags = require("./tags.json");

const videoRoutes = require("./routes/video.json");
const streamRoutes = require("./routes/stream.json");

const videoModels = require("./models/video.json");
const streamModels = require("./models/stream.json");

const paths = {
    ...videoRoutes,
    ...streamRoutes,
};

const definitions = {
    ...videoModels,
    ...streamModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
    host: process.env.BASE_URL,
};

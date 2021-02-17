const mongoose = require("mongoose");
const { Schema } = mongoose;

const streamSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    poster: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

streamSchema.index({ title: "text", url: "text" });

module.exports = mongoose.model("Streams", streamSchema);

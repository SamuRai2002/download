const mongoose = require("mongoose");
const { Schema } = mongoose;

const videoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    downloads: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    size: {
        type: String,
    },
    categories: [String],
    date: {
        type: Date,
        default: Date.now,
    },
});

videoSchema.index({ title: "text", categories: "text", url: "text" });

module.exports = mongoose.model("Videos", videoSchema);

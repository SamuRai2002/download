const Video = require("../models/Video");
const Stream = require("../models/Stream");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.home = catchAsync(async (req, res, next) => {
    res.render("index");
});

exports.latestAll = catchAsync(async (req, res, next) => {
    const limit = 12;
    const skip = limit * req.query.page;

    const videos = await Video.find()
        .sort({ date: -1 })
        .select("title image")
        .skip(skip)
        .limit(limit)
        .lean();

    const count = await Video.find().count();

    res.status(200).render("latest_videos", { videos: videos, count: count });
});

exports.trend = catchAsync(async (req, res, next) => {
    const limit = 12;
    const skip = limit * req.query.page;

    const videos = await Video.find()
        .sort({ downloads: -1 })
        .select("title image")
        .skip(skip)
        .limit(limit)
        .lean();

    const count = await Video.countDocuments();

    res.status(200).render("most_downloaded_videos", {
        videos: videos,
        count: count,
    });
});

exports.singleVideo = catchAsync(async (req, res, next) => {
    const video = await Video.findByIdAndUpdate(
        req.params.id,
        {
            $inc: {
                downloads: 1,
            },
        },
        { new: true }
    );

    res.status(200).render("single_video", { video: video });
});

exports.stream = catchAsync(async (req, res, next) => {
    const limit = 12;
    const skip = limit * req.query.page;

    const videos = await Stream.find()
        .sort({ date: -1 })
        .select("title poster")
        .skip(skip)
        .limit(limit)
        .lean();

    const count = await Stream.countDocuments();

    res.status(200).render("latest_stream", { videos: videos, count: count });
});

exports.streamTop = catchAsync(async (req, res, next) => {
    const limit = 12;
    const skip = limit * req.query.page;

    const videos = await Stream.find()
        .sort({ views: -1 })
        .select("title poster")
        .skip(skip)
        .limit(limit)
        .lean();

    const count = await Stream.countDocuments();

    res.status(200).render("most_watched", { videos: videos, count: count });
});

exports.singleStream = catchAsync(async (req, res, next) => {
    const video = await Stream.findByIdAndUpdate(
        req.params.id,
        {
            $inc: {
                views: 1,
            },
        },
        { new: true }
    );

    res.status(200).render("single_stream", { video: video });
});

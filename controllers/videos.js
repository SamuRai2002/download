const Video = require("../models/Video");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const rp = require("request-promise");
const cheerio = require("cheerio");
const axios = require("axios");

exports.getAll = catchAsync(async (req, res, next) => {
    const videos = await Video.find().lean();

    res.status(200).json({
        success: true,
        data: videos,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const video = await Video.findById(req.params.id).lean();

    if (!video) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: video,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const url = "http://qqxnxx.com/";

    const parsed = await axios.get(url);
    //console.log(parsed.data);
    let $ = cheerio.load(parsed.data);
    const links = $("div[class='col-md-3 col-sm-4 col-xs-6']").find("a");
    //console.log(link[30]);

    let page;
    let videos = {};
    let baseVid;
    let attrs = {};
    let count = 0;
    for (let i = 0; i < links.length; i++) {
        page = await axios.get(url + links[i].attribs.href);
        $ = cheerio.load(page.data);

        attrs = $("div[class='col-sm-8']")
            .find("ul > li > span")
            .map(function () {
                return $(this).text();
            })
            .get();

        videos = {
            title: $("div[class='col-sm-8']").find("h3").text(),
            image: $("div[class='video-screen']").find("img").attr("src"),
            size: attrs[2],
            downloads: Math.floor(attrs[0] / 100) * 10,
            url: url + $("a[class='btn btn-primary']").attr("href"),
            categories: $("ul > li > a")
                .map(function () {
                    return $(this).text();
                })
                .get(),
        };

        baseVid = await Video.findOne({ url: videos.url }).select("url").lean();
        if (!baseVid) {
            await Video.create(videos);
            count++;
        }
    }

    res.status(201).json({
        success: true,
        data: count,
    });
});

exports.createSingle = catchAsync(async (req, res, next) => {
    const url = "http://qqxnxx.com/";

    let page = await axios.get(req.body.link);
    let $ = cheerio.load(page.data);

    let attrs = $("div[class='col-sm-8']")
        .find("ul > li > span")
        .map(function () {
            return $(this).text();
        })
        .get();

    let video = {
        title: $("div[class='col-sm-8']").find("h3").text(),
        image: $("div[class='video-screen']").find("img").attr("src"),
        size: attrs[2],
        downloads: Math.floor(attrs[0] / 100) * 10,
        url: url + $("a[class='btn btn-primary']").attr("href"),
        categories: $("ul > li > a")
            .map(function () {
                return $(this).text();
            })
            .get(),
    };

    baseVid = await Video.findOne({ url: video.url }).select("url").lean();
    if (!baseVid) {
        video = await Video.create(video);
    }

    res.status(201).json({
        success: true,
        data: video,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).lean();

    if (!video) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: video,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Video.findById(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});

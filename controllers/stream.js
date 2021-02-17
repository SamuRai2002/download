const Stream = require("../models/Stream");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const rp = require("request-promise");
const cheerio = require("cheerio");
const axios = require("axios");

exports.getAll = catchAsync(async (req, res, next) => {
    const stream = await Stream.find().lean();

    res.status(200).json({
        success: true,
        data: stream,
    });
});

exports.get = catchAsync(async (req, res, next) => {
    const stream = await Stream.findById(req.params.id).lean();

    if (!stream) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: stream,
    });
});

exports.create = catchAsync(async (req, res, next) => {
    const url = `http://www.hostiex.com/latest-porn/${req.query.page}/`;

    let parsed = await axios.get(url);
    //console.log(parsed.data);
    let $ = cheerio.load(parsed.data);
    const links = $("div[class='card']")
        .find("a")
        .map(function () {
            return $(this).attr("href");
        })
        .get();

    let result = [];
    let obj = {};
    let stream = {};

    for (let i = 0; i < links.length; i += 2) {
        parsed = await axios.get(links[i]);
        $ = cheerio.load(parsed.data);

        obj = {
            title: $("div[class='row h']")
                .find("h1")
                .map(function () {
                    return $(this).text();
                })
                .get()[0],
            poster: $("video").attr("poster"),
            url: $("video > source").attr("src"),
            duration: $("span")
                .map(function () {
                    return $(this).text();
                })
                .get()[2],
        };
        result.push(obj);

        stream = await Stream.findOne({ url: obj.url }).select("url").lean();
        if (!stream) {
            await Stream.create(obj);
        }
    }

    res.status(201).json({
        success: true,
        data: result,
    });
});

exports.update = catchAsync(async (req, res, next) => {
    const stream = await Stream.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).lean();

    if (!stream) return next(new AppError(404, errors.NOT_FOUND));

    res.status(200).json({
        success: true,
        data: stream,
    });
});

exports.delete = catchAsync(async (req, res, next) => {
    await Stream.findById(req.params.id);

    res.status(204).json({
        success: true,
        data: null,
    });
});

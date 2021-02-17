const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const swagger = require("swagger-ui-express");
const swaggerDocs = require("./docs");
const globalErrorHandler = require("./controllers/error");
const AppError = require("./utils/appError");
const indexRouter = require("./routes");

// Initialize express app
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// handling views
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

// Routes
app.use("/api/docs", swagger.serve, swagger.setup(swaggerDocs));

indexRouter(app);

// 404 Error
app.all("*", (req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;

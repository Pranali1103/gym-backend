const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const path = require('path');

const app = express();

// ✅ Logging setup
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// ✅ Security and parsing middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(cors());
app.options('*', cors());

// ✅ Passport JWT setup (important to register BEFORE routes)
passport.use('jwt', jwtStrategy);
app.use(passport.initialize());

// ✅ Apply rate limiter in production
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// ✅ Main routes
app.use('/v1', routes);

// ✅ 404 handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// ✅ Error converter and handler
app.use(errorConverter);
app.use(errorHandler);

app.use('/uploads', express.static('uploads'));
// ✅ Serve uploads folder publicly
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


module.exports = app;

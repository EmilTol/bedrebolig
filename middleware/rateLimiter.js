const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit ({
    windowMs: 15*60*1000,
    max: 10,
    message: {error: "Too many login attempts"},
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter };



"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise-native");
const errors = require("request-promise-native/errors");
const exception_1 = require("./exception");
function execute(opt) {
    return rp(opt).catch((err) => {
        if (err instanceof errors.StatusCodeError) {
            throw new exception_1.RequestError(err.statusCode, err.message);
        }
        else {
            throw new exception_1.ClientError(err.message);
        }
    });
}
exports.execute = execute;

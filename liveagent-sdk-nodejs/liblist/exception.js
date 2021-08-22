"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.ClientError = ClientError;
class InvalidConfig extends ClientError {
    constructor(confName, msg) {
        super(msg);
        this.confName = confName;
    }
}
exports.InvalidConfig = InvalidConfig;
class RequestError extends Error {
    constructor(code, msg) {
        super(msg);
        this.code = code;
    }
}
exports.RequestError = RequestError;

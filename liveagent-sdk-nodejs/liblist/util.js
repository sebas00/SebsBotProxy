"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
function generateId() {
    return uuid.v1();
}
exports.generateId = generateId;

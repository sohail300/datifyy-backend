"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const rateLimiter_1 = __importDefault(require("../middlewares/rateLimiter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const route = (0, express_1.Router)();
route.get('/secure', authenticate_1.default, rateLimiter_1.default, (req, res) => {
    console.log('Secure Route');
    res.send('Secure Route');
});
exports.default = route;

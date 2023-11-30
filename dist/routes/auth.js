"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const route = (0, express_1.Router)();
const saltRounds = 10;
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
const prisma = new client_1.PrismaClient();
// zod validation
const signupInput = zod_1.z.object({
    email: zod_1.z
        .string()
        .email({ message: "Invalid Email Address" })
        .min(1, { message: "Email Empty" }),
    username: zod_1.z
        .string()
        .min(3, { message: "Username too short, should be between 3 to 15" })
        .max(15, { message: "Username too long, should be between 3 to 15" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password too short, should be between 8 to 15" })
        .max(15, { message: "Password too long, should be between 8 to 15" })
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%&*-])[a-zA-Z\d!@#$%&*-]{8,15}$/, {
        message: "Password must contain at least 1 letter, atleast 1 number, atleast 1 special character",
    }),
});
route.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = signupInput.safeParse(req.body);
        if (parsedInput.success === false) {
            return res.status(411).json({
                msg: parsedInput.error,
            });
        }
        const { username, email, password } = parsedInput.data;
        // Checking if username or email has already been registered, if yes, then return an error message else create a new user.
        const user = yield prisma.user.findFirst({
            where: {
                OR: [{ email: email }, { username: username }],
            },
        });
        if (user) {
            return res.status(403).send("User already Exists");
        }
        else {
            // Hashing password
            const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
            // Creating new User
            const newUser = yield prisma.user.create({
                data: {
                    email: email,
                    username: username,
                    password: hashedPassword,
                },
            });
            if (!secretKey) {
                return res.status(403).send("Secret not defined");
            }
            // Creating JWT and passing it to the frontend to store it to local storage, which wouldn't require the user to login again, the user can be redirected to the home page and the token can be used to login the user automatically.
            const token = jsonwebtoken_1.default.sign({ id: newUser.id }, secretKey, {
                expiresIn: "1h",
            });
            return res.status(201).json(token);
        }
    }
    catch (err) {
        return res.status(500).send({ "Internal Error": err });
    }
}));
// zod validation
const loginInput = zod_1.z.object({
    identifier: zod_1.z.string().min(1, { message: "Field Empty" }),
    password: zod_1.z.string().min(1, { message: "Field Empty" }),
});
route.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = loginInput.safeParse(req.body);
        if (parsedInput.success === false) {
            return res.status(411).json({
                msg: parsedInput.error,
            });
        }
        const { identifier, password } = parsedInput.data;
        // Check if username or email has already been registered, if yes, then create JWT and pass it to the frontend to store it to local storage otherwise return error.
        const user = yield prisma.user.findFirst({
            where: {
                OR: [{ username: identifier }, { email: identifier }],
            },
        });
        if (!user) {
            return res.status(404).json({ error: "Invalid credentials" });
        }
        else {
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (!secretKey) {
                return res.status(403).send("Secret not defined");
            }
            if (match) {
                // Creating JWT and passing it to the frontend to store it to local storage
                const token = jsonwebtoken_1.default.sign({ id: user.id }, secretKey, {
                    expiresIn: "1h",
                });
                return res.status(200).json(token);
            }
            else {
                return res.status(403).send("Invalid Credentials");
            }
        }
    }
    catch (err) {
        return res.status(500).send({ "Internal Error": err });
    }
}));
exports.default = route;

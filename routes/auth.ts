import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import dotenv from "dotenv";

const route = Router();
const saltRounds = 10;

dotenv.config();
const secretKey = process.env.SECRET_KEY;

const prisma = new PrismaClient();

// zod validation
const signupInput = z.object({
  email: z
    .string()
    .email({ message: "Invalid Email Address" })
    .min(1, { message: "Email Empty" }),
  username: z
    .string()
    .min(3, { message: "Username too short, should be between 3 to 15" })
    .max(15, { message: "Username too long, should be between 3 to 15" }),
  password: z
    .string()
    .min(8, { message: "Password too short, should be between 8 to 15" })
    .max(15, { message: "Password too long, should be between 8 to 15" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%&*-])[a-zA-Z\d!@#$%&*-]{8,15}$/, {
      message:
        "Password must contain at least 1 letter, atleast 1 number, atleast 1 special character",
    }),
});

route.post("/signup", async (req, res) => {
  try {
    const parsedInput = signupInput.safeParse(req.body);

    if (parsedInput.success === false) {
      return res.status(411).json({
        msg: parsedInput.error,
      });
    }

    const { username, email, password } = parsedInput.data;

    // Checking if username or email has already been registered, if yes, then return an error message else create a new user.
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (user) {
      return res.status(403).send("User already Exists");
    } else {
      // Hashing password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Creating new User
      const newUser = await prisma.user.create({
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
      const token = jwt.sign({ id: newUser.id }, secretKey, {
        expiresIn: "1h",
      });

      return res.status(201).json(token);
    }
  } catch (err) {
    return res.status(500).send({ "Internal Error": err });
  }
});

// zod validation
const loginInput = z.object({
  identifier: z.string().min(1, { message: "Field Empty" }),
  password: z.string().min(1, { message: "Field Empty" }),
});

route.post("/login", async (req, res) => {
  try {
    const parsedInput = loginInput.safeParse(req.body);

    if (parsedInput.success === false) {
      return res.status(411).json({
        msg: parsedInput.error,
      });
    }

    const { identifier, password } = parsedInput.data;

    // Check if username or email has already been registered, if yes, then create JWT and pass it to the frontend to store it to local storage otherwise return error.
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    } else {
      const match = await bcrypt.compare(password, user.password);

      if (!secretKey) {
        return res.status(403).send("Secret not defined");
      }

      if (match) {
        // Creating JWT and passing it to the frontend to store it to local storage
        
        const token = jwt.sign({ id: user.id }, secretKey, {
          expiresIn: "1h",
        });
        return res.status(200).json(token);
      } else {
        return res.status(403).send("Invalid Credentials");
      }
    }
  } catch (err) {
    return res.status(500).send({ "Internal Error": err });
  }
});

export default route;

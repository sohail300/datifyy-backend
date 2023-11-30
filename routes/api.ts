import { Router } from "express";
import authenticate from '../middlewares/authenticate';
import limiter from '../middlewares/rateLimiter';
import dotenv from "dotenv";

dotenv.config();
const route = Router();

route.use('/secure', authenticate, limiter);

export default route;


  
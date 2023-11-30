import { Router } from "express";
import authenticate from '../middlewares/authenticate';
import limiter from '../middlewares/rateLimiter';
import dotenv from "dotenv";

dotenv.config();
const route = Router();

route.get('/secure', authenticate, limiter , (req,res) => {
    console.log('Secure Route');
    res.send('Secure Route');
});

export default route;


  
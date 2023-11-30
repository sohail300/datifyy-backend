import rateLimit from 'express-rate-limit';

// Define rate limit middleware for the protected endpoint
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 600, // Max X requests per windowMs
    message: 'Too many requests, please try again later.',
  });

  export default limiter;
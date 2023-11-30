## Deployed Link
    - https://datifyy-backend.onrender.com/

## Setup

1. Clone the repo 
   ```sh
   git clone https://github.com/sohail300/datifyy-backend.git
   ```

2. Go to the project folder
   ```sh
   cd datifyy-backend
   ```

3. Install packages with npm
   ```sh
   npm install
   ```

4. Set up your `.env` file
   - Duplicate `.env.example` to `.env`
   - Use `openssl rand -base64 32` to generate a key and add it under `SECRET_KEY` in the `.env` file.
   - Create a local PostgreSQL DB or create a online one with the help of https://supabase.com/ or https://neon.tech/ and add the DB url under `DATABASE_URL` in the `.env` file.

## Use

1. Come to the datifyy-backend directory and run the server.
   ```sh
   npm run dev
   ```

2. Now open the Postman API file in Postman and test the routes in the given format.

## How to use the APIs

1. signup route
    - The user will give email, username and password.
    - Email and Username should be unique, i.e., shouldn't match with any other user's email or username.
    - Email's length must be between 3 to 15
    - Password's length must be between 8 to 15 
    - Password must contain at least 1 letter, atleast 1 number, atleast 1 special character.

2. login route
    - The user will give (email or username) and password.
    - The field that the user has given either email or username will be called identifier (can be seen in Postman API).


## Rate Limiter

   - I used 600 requests per minute because it is perfect for every endpoint in the application.
   - In rate limiter, we count request per user or IP address, using a data store or in-memory storage.
   - Maintain a counter for each user/IP to keep track of the number of requests made within the defined time window.
   - When the rate limit is exceeded, we return an appropriate HTTP status code (e.g., 429 Too Many Requests) to indicate that the user has reached the limit for a given time period.

## How I deployed it on Render

   - Used build command for building
        ```sh
        npm run build 
        ```
   
   - Used start command for starting the server
        ```sh
        npm start 
        ```

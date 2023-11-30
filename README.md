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

## How I deployed it on Render

   - Used build command for building
   ```sh
   npm run build 
   ```
   
   - Used start command for starting the server
   ```sh
   npm start 
   ```
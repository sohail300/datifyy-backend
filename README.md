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
   
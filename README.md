## Development

### Setup

1. Clone the repo into a public GitHub repository (or fork https://github.com/calcom/cal.com/fork). If you plan to distribute the code, keep the source code public to comply with [AGPLv3](https://github.com/calcom/cal.com/blob/main/LICENSE). To clone in a private repository, [acquire a commercial license](https://cal.com/sales)

   ```sh
   git clone https://github.com/calcom/cal.com.git
   ```

   > If you are on Windows, run the following command on `gitbash` with admin privileges: <br> > `git clone -c core.symlinks=true https://github.com/calcom/cal.com.git` <br>
   > See [docs](https://cal.com/docs/how-to-guides/how-to-troubleshoot-symbolic-link-issues-on-windows#enable-symbolic-links) for more details.

2. Go to the project folder

   ```sh
   cd cal.com
   ```

3. Install packages with yarn

   ```sh
   yarn
   ```

4. Set up your `.env` file

   - Duplicate `.env.example` to `.env`
   - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
   - Use `openssl rand -base64 24` to generate a key and add it under `CALENDSO_ENCRYPTION_KEY` in the `.env` file.

5. Setup Node
   If your Node version does not meet the project's requirements as instructed by the docs, "nvm" (Node Version Manager) allows using Node at the version required by the project:

   ```sh
   nvm use
   ```

   You first might need to install the specific version and then use it:

   ```sh
   nvm install && nvm use
   ```

   You can install nvm from [here](https://github.com/nvm-sh/nvm).

#### Quick start with `yarn dx`

> - **Requires Docker and Docker Compose to be installed**
> - Will start a local Postgres instance with a few test users - the credentials will be logged in the console

```sh
yarn dx
```

#### Development tip

> Add `NEXT_PUBLIC_DEBUG=1` anywhere in your `.env` to get logging information for all the queries and mutations driven by **tRPC**.

```sh
echo 'NEXT_PUBLIC_DEBUG=1' >> .env
```

#### Gitpod Setup

1. Click the button below to open this project in Gitpod.

2. This will open a fully configured workspace in your browser with all the necessary dependencies already installed.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/calcom/cal.com)

#### Manual setup

1. Configure environment variables in the `.env` file. Replace `<user>`, `<pass>`, `<db-host>`, and `<db-port>` with their applicable values

   ```
   DATABASE_URL='postgresql://<user>:<pass>@<db-host>:<db-port>'
   ```

   <details>
   <summary>If you don't know how to configure the DATABASE_URL, then follow the steps here to create a quick local DB</summary>

   1. [Download](https://www.postgresql.org/download/) and install postgres in your local (if you don't have it already).

   2. Create your own local db by executing `createDB <DB name>`

   3. Now open your psql shell with the DB you created: `psql -h localhost -U postgres -d <DB name>`

   4. Inside the psql shell execute `\conninfo`. And you will get the following info.  
      ![image](https://user-images.githubusercontent.com/39329182/236612291-51d87f69-6dc1-4a23-bf4d-1ca1754e0a35.png)

   5. Now extract all the info and add it to your DATABASE_URL. The url would look something like this
      `postgresql://postgres:postgres@localhost:5432/Your-DB-Name`.

   </details>

   If you don't want to create a local DB. Then you can also consider using services like railway.app or render.

   - [Setup postgres DB with railway.app](https://arctype.com/postgres/setup/railway-postgres)
   - [Setup postgres DB with render](https://render.com/docs/databases)

1. Copy and paste your `DATABASE_URL` from `.env` to `.env.appStore`.

1. Set a 24 character random string in your `.env` file for the `CALENDSO_ENCRYPTION_KEY` (You can use a command like `openssl rand -base64 24` to generate one).
1. Set up the database using the Prisma schema (found in `packages/prisma/schema.prisma`)

   In a development environment, run:

   ```sh
   yarn workspace @calcom/prisma db-migrate
   ```

   In a production environment, run:

   ```sh
   yarn workspace @calcom/prisma db-deploy
   ```

1. Run [mailhog](https://github.com/mailhog/MailHog) to view emails sent during development

   > **_NOTE:_** Required when `E2E_TEST_MAILHOG_ENABLED` is "1"

   ```sh
   docker pull mailhog/mailhog
   docker run -d -p 8025:8025 -p 1025:1025 mailhog/mailhog
   ```

1. Run (in development mode)

   ```sh
   yarn dev
   ```

#### Setting up your first user

##### Approach 1

1. Open [Prisma Studio](https://prisma.io/studio) to look at or modify the database content:

   ```sh
   yarn db-studio
   ```

1. Click on the `User` model to add a new user record.
1. Fill out the fields `email`, `username`, `password`, and set `metadata` to empty `{}` (remembering to encrypt your password with [BCrypt](https://bcrypt-generator.com/)) and click `Save 1 Record` to create your first user.
   > New users are set on a `TRIAL` plan by default. You might want to adjust this behavior to your needs in the `packages/prisma/schema.prisma` file.
1. Open a browser to [http://localhost:3000](http://localhost:3000) and login with your just created, first user.

##### Approach 2

Seed the local db by running

```sh
cd packages/prisma
yarn db-seed
```

The above command will populate the local db with dummy users.
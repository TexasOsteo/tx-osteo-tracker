# Setup

Please follow all of these steps to setup your development environment correctly. For deployment, use the [Azure](#how-to-setup-azure) section.

### 1. Install required programs

- Install [git](https://git-scm.com/)
- Install [VS Code](https://code.visualstudio.com/)
- Install these VS Code extensions:
  - [Vue Language Support (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
- Install [Postgres 16](https://www.postgresql.org/download/) with default settings
- Install [Node.js](https://nodejs.org/en)
  - If asked to install NPM or any other dependencies, select yes
- After installing all of these, restart your computer

### 2. Clone repository

- Open VS Code
- Press `Control + Shift + P` to open the command palette
  - Can also go to `View > Command Palette`
- Select `Git: Clone`
- Paste the url of this repository (`https://github.com/UTDallasEPICS/tx-osteo-tracker`)
- Select the location you want your project directory to be
- Open the repository location in VS Code

### 3. Setup Postgres and Prisma

- Open pgAdmin 4 (installed with Postgres 16)
- Keep the username of the master account as `postgres`
- When prompted for a master password, enter a password that is long but simple (no complex characters). **Remember this password**
- Under the default Postgres 16 server, create a new database and name it something simple (e.g. `testdb`)
- Create a `.env` text file at the project repository root in VS Code
- Add a new line to the `.env` file: `DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/NAME?schema=public"` where `PASSWORD` is your account password and `NAME` is the database name
- Open the terminal in VS Code with `Control + `` or go to `Terminal > New Terminal`
- In the terminal, run `npm install -g prisma`
- Restart your computer

### 4. Setup environment variables

- Check if the `ENV Secrets` file is up to date on Edusourced. If this file exists and is valid, you can just copy the values from there into `.env` and skip this whole step. Otherwise, please follow along.
- If no Auth0 application exists, create one by following [these instructions](#how-to-setup-auth0). If one already exists, ask for an invite.
- Once Auth0 is setup, go to the application's settings and copy `Domain`, `Client ID`, and `Client Secret`
- Add three new lines to the `.env` file with the copied values:

```
AUTH0_DOMAIN="SOMETHING.us.auth0.com"
AUTH0_CLIENTID="copied from client id field"
AUTH0_SECRET="copied from client secret field"
```

- If Azure is not setup, follow the instructions [here](#how-to-setup-azure). Setup the environment variables as described in the section.
- You should have variables similar to `.env.example`

### 5. Start development

- In the VS Code terminal, run `npm install` at the project root
- Run `prisma migrate dev` to update the database schema
- Run `npm run dev` to start the development server
- You are now ready to start developing!

# How to setup auth0

- Create an account or sign in at [auth0.com](https://auth0.com/)
- Create a new tenant, give it a name, and chose `development`
- Go to the the tenant's `Getting Started` page
- Click on `Create Application`, give it a name, and choose `Regular Web Application`
- Click `Skip Integration`
- Go to the application's settings
- Under `Allowed Callback URLs` add the following:

```
http://localhost:3000/api/auth/callback/login,
http://127.0.0.1:3000/api/auth/callback/login,
http://localhost:3001/api/auth/callback/login,
http://127.0.0.1:3001/api/auth/callback/login
```

- Under `Allowed Logout URLs` add the following:

```
http://localhost:3000/api/auth/callback/logout,
http://127.0.0.1:3000/api/auth/callback/logout,
http://localhost:3001/api/auth/callback/logout,
http://127.0.0.1:3001/api/auth/callback/logout
```

- Click `Save`
- Add team members by going to `Tenant Settings > Tenant Members`

# How to setup Azure

The following services must be created and configured properly:

- Azure SQL for Postgres
  - Make sure connections are allowed via a url (i.e. `postgres://...`)
- Static Web App
  - Configure to deploy based on this GitHub repo
  - Modify the generated Github action to include the environment variable `DISABLE_ENV_CHECKING="true"`
  - **Make sure to include all required [environment variables](#4-setup-environment-variables) with a `NUXT_` prefix, except `DATABASE_URL`**
- BLOB Storage
  - Need `images` container (configure for BLOB-level anonymous access)
  - Need `qualifications` container (no anonymous access)
- Front Door / CDN Profile with Endpoint
  - Configure to point to BLOB Storage
- Communication Service
  - Create associated email communication service and a `DoNotReply` email domain
- Azure Functions
  - Create a function app and copy the function code from this repository
  - Create a timer trigger for weekly digest updates
- If a custom domain is to be used, the DNS records for the domain should be setup to allow for Azure to use it. Static Web App and the email service should then be configured to use it.

Once these services are correctly setup, they can be used to fill out the environment variables:

- `AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING`
  - The connection string for the communication service
  - Found in the Keys section
- `AZURE_CDN_ORIGIN`
  - The origin URL (i.e. `https://www.example.net/`) for the CDN/Frontdoor profile
- `AZURE_EMAIL_ADDRESS`
  - The created `DoNotReply` email domain
- `AZURE_STORAGE_ACCOUNT_NAME`
  - The literal name of the created BLOB Storage account
- `AZURE_STORAGE_CONNECTION_STRING`
  - The connection string for the BLOB Storage account
  - Found in the Keys section
- `AZURE_STORAGE_SHARED_KEY`
  - The access key for the BLOB Storage account
  - Found in the Keys section next to the connection string
- `OVERRIDE_HOST`
  - When deployed, set this to the host domain (i.e. `volunteer.texasosteo.org`)
- `DATABASE_URL`
  - The Postgres connection string (i.e. `postgres://...`) from Azure SQL

If deploying, all these environment variables along with the Auth0 variables should be included in the Static Web App environment variable section. Make sure all environment variables except `DATABASE_URL` are prefixed with `NUXT_`.

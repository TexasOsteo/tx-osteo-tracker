# Setup

Please follow all of these steps to setup your development environment correctly. For deployment, mostly use the [Azure](#how-to-setup-azure) section.

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

### 3. Setup Postgres and Prisma (For Local Development)

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
- Create a new tenant and give it a name
- Go to the the tenant's `Getting Started` page
- Click on `Create Application`, give it a name, and choose `Regular Web Application`
- Click `Skip Integration`
- Go to the application's settings
- Under `Allowed Callback URLs` add the following (replace `[HOSTNAME]` with the web server address):

```
https://[HOSTNAME]/api/auth/callback/login
```

- Under `Allowed Logout URLs` add the following:

```
https://[HOSTNAME]/api/auth/callback/logout
```

- Under `Advanced > OAuth`, enable the `HS256` authentication method.
- Click `Save`
- Go to `Applications > APIs` and choose the default management API
- Go to `Machine to Machine Applications` and click the dropdown for the created application
- Add the `update:users` permission and click update
- Add team members by going to `Tenant Settings > Tenant Members`

# How to setup Azure

The following services must be created and configured properly for deployment. Some of these services (i.e. the database) can be skipped for local development.

- Azure SQL for Postgres
  - Make sure connections are allowed via a url (i.e. `postgres://...`)
  - The url will be formatted like a normal Prisma Postgres URL with the username and password configured when creating the service
  - Enable the setting to make the service is accessible to all Azure services
  - To initialize the database, temporarily add your own IP address to the network settings, change the local `DATABASE_URL` environment variable to the deployed database, and run `prisma migrate dev`
- Static Web App
  - Configure to deploy based on this GitHub repo
  - Modify the generated Github action to include the environment variable `DISABLE_ENV_CHECKING="true"`
  - **Make sure to include all required [environment variables](#4-setup-environment-variables) with a `NUXT_` prefix, except `DATABASE_URL`**
- BLOB Storage
  - Make sure the setting to allow changing anonymous access at the container level is enabled
  - Need `images` container (configure for BLOB-level anonymous access)
  - Need `qualifications` container (no anonymous access)
- Front Door / CDN Profile with Endpoint
  - Configure to point to BLOB Storage
- Communication Service
  - Create associated email communication service and a `DoNotReply` email domain
- Azure Functions
  - Create a function app and deploy the function code from the `functions` directory in this repo
  - Recommended to use the [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  - Copy the `AUTH0_SECRET` env variable into the function app from the static web app (don't include `NUXT_` prefix)
  - Add a `HOST_ORIGIN` env variable that points to the static web host origin (i.e. `https://volunteer.texasosteo.org`)
  - Add a `AzureWebJobsStorage` env variable with the same value as `AZURE_STORAGE_CONNECTION_STRING`
- If a custom domain is to be used, the DNS records for the domain should be setup to allow for Azure to use it. Static Web App, the email service, and the functions app should then be configured to use it.

Once these services are correctly setup, they can be used to fill out the environment variables for the static web app. When using the static web app, prefix all variables except `DATABASE_URL` with `NUXT_`. If developing locally, this does not need to be done, and simply follow `.env.example`.

- (`NUXT_`) `AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING`
  - The connection string for the communication service
  - Found in the Keys section
- (`NUXT_`) `AZURE_CDN_ORIGIN`
  - The origin URL (i.e. `https://www.example.net/`) for the CDN/Frontdoor profile
- (`NUXT_`) `AZURE_EMAIL_ADDRESS`
  - The created `DoNotReply` email domain
- (`NUXT_`) `AZURE_STORAGE_ACCOUNT_NAME`
  - The literal name of the created BLOB Storage account
- (`NUXT_`) `AZURE_STORAGE_CONNECTION_STRING`
  - The connection string for the BLOB Storage account
  - Found in the Keys section
- (`NUXT_`) `AZURE_STORAGE_SHARED_KEY`
  - The access key for the BLOB Storage account
  - Found in the Keys section next to the connection string
- (`NUXT_`) `OVERRIDE_HOST`
  - When deployed, set this to the host domain (i.e. `volunteer.texasosteo.org`)
- `DATABASE_URL`
  - The Postgres connection string (i.e. `postgres://...`) from Azure SQL

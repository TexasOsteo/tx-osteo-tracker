# Setup

Please follow all of these steps to setup your development environment correctly.

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

- If Azure is not setup, follow the instructions [here](#how-to-setup-azure).
- Once Azure is setup, go to the storage account and go to `Access Keys`
- Copy the first key's `Connection String` into a new line in `.env`:

```
AZURE_STORAGE_CONNECTION_STRING="copied from connection string field"
```

- Go to the storage account's `Front Door and CDN` page
- Copy the host name of the first endpoint (should end in `azureedge.net`) into a new line:

```
AZURE_CDN_ORIGIN="https://SOMETHING.azureedge.net/"
```

- You should have a total of six environment variables similar to `.env.example`

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
- Go to `Applications > APIs` and choose the default management API
- Go to `Machine to Machine Applications` and click the dropdown for the created application
- Add the `update:users` permission and click update
- Add team members by going to `Tenant Settings > Tenant Members`

# How to setup Azure

- Create an Azure account through Microsoft or GitHub.
  - GitHub provides a free $100 credit through its [education program](https://education.github.com/)
- Follow the steps [here](https://learn.microsoft.com/en-us/azure/cdn/cdn-create-a-storage-account-with-cdn) how to create a storage account and enable CDN/Front Door
  - Make sure the new endpoint is for a `Azure CDN`
- Under the storage account, go to `Storage Browser`
- Go to `Blob Containers`
- Add a new container. Name it `images` exactly and give it a blob-level anonymous access level.

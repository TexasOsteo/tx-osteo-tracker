# Texas Osteoporosis Foundation Volunteer System

Setting up Nuxt

- Clone repository
- Open with VS Code
- In terminal, run `npm install` (make sure Node / NPM is installed)
- Run `npm run dev` to run development server
- Navigate to `http://localhost:3000/` and you're done!

Setting up local database

- Install [Postgres 16](https://www.postgresql.org/download/) with default settings
- Open pgAdmin 4
- Under the default Postgres 16 server, create a new database and name it something simple (e.g. `testdb`)
- Create a `.env` file at the project root
- Add a new line to the `.env` file: `DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/NAME?schema=public"` where `PASSWORD` is your account password and `NAME` is the database name
- Install Prisma globally with `npm install -g prisma`. This allows `prisma` to be called from the command line. (You may need to restart your computer)
- You can now use Prisma with the local Postgres database!

Required VS Code extensions

- [Vue Language Support - VOLAR](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
- [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) (Recommended)

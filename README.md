# Record Editor

This is a simple race time book keeping web application for keeping track your and your friends racing times. This is a hobby project  created for keeping track times in a Forza Horizon 5 game.

## Getting Started

First install all dependencies

```bash
npm install
```

Second, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Database

Record Editor uses a Postgresql database for storing it's data. All information related to tracks, drivers, sessions and records are hold in the database. For creating database you find a text file holding Record editor's database schema from `database/record-editor-schema.sql` file.

To dump out database schema form after any alteration can be made by using pg_dump command.

`pg_dump -U <username> -s record-editor > record-editor-schema.sql`

For a database UI you can use pgAdmin4 tool or use the terminal tool. Witch one is easier for you.

Project database settings are stored root of project folder in a file called `.env.local`. This is where Node.js read it's enviroment variables. This file is not stored in version history for opvious security issues.

Example of the file content, to use the application you need to create this file manually root of the folder.

```
PGSQL_HOST= 127.0.0.1
PGSQL_PORT= 5432
PGSQL_DATABASE= record-editor
PGSQL_USER= 
PGSQL_PASSWORD= 
```

## Learn More 

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
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

There is a dostgres docker container can be run up with a command `docker compose up db`... it is a still in a very early state so setting up process in not yeat fully automated.

Username and password to database can be found from [docker-compose.yaml](https://github.com/puumuki/record-editor/blob/master/docker-compose.yaml);

Record Editor uses a Postgresql database for storing it's data. All information related to tracks, drivers, sessions and records are hold in the database. For creating database you find a text file holding Record editor's database schema from `database/record-editor-schema.sql` file.

To dump out database schema form after any alteration can be made by using pg_dump command.

`pg_dump -U <username> -s db > record-editor-schema.sql`

For a database UI you can use pgAdmin4 tool or use the terminal tool. Witch one is easier for you.

Project database settings are stored root of project folder in a file called `.env.local`. This is where Node.js read it's enviroment variables. This file is not stored in version history for opvious security issues.

Example of the file content, to use the application you need to create this file manually root of the folder.

### Mock data

There is a set of mock data that can be used to generate some content for the development purposes. You find a yuml file from [here](https://github.com/puumuki/record-editor/blob/master/public/forza-ajat-2022-11-12.yaml). After that use a [https://localhost:3000/import](https://localhost:3000/import) to convert this data to SQL. This is a old set of records that was converted gathered to text fila and converted to yuml file manually.

This SQL can be pushed to database same way as schema `pg_dump -U <username> -s record-editor > record-editor-schema.sql`.

![Mocking data](./public/data-import.png?=raw)

# Environment variables file

Node.js need some configurations like database password, port and database name. These are set by creating a file called `.env.local` Node.js process read environment variables from there. 

Example file: 

```
DATABASE_URL=
PGSQL_HOST= 127.0.0.1
PGSQL_PORT= 5432
PGSQL_DATABASE=db
PGSQL_USER=app
PGSQL_PASSWORD=app 
GITHUB_ID=
GITHUB_SECRET=
```

Variables explained `DATABASE_URL` is a alternative way to connect to Postgres database, it takes a Postgres connection string. An alternative way to form a connection to database is use `PGSQL_HOST` host address witch can be 'localhost' or `127.0.0.1` or similar. `PSQL_PORT` is for port number for Postgres sever. `PGSQL_DATABASE` is Postgres database name. `PGSQL_USER` is Potgres user name and `PGSQL_PASSWORD` is the Postgres user password.

`GITHUB_ID` is oAuth application id for authenticating user and `GITHUB_SECRET` is some secret key.


# Create certificates for running on HTTPS protocol

... write something ...

## Setting up database

Note: This step is expecting that you have installed `psql` command line tool.

Easiest way to set up a Postgres database for the project is using a Docker. By running a command `docker-compose up db` this downloads images and set up docker container for Postgres server.

Next phase is to create database structure called schema. You can find two files from the project one for creating the database and second one for inserting test data.

Script will ask for a password, in the development environment it is a `app`.

For creating a database structure run command: `psql -U app -d db -a -f ./database/record-editor-schema.sql -p 5432 -h localhost`

For inserting test data run `psql -U app -d db -a -f ./database/record-editor-data.sql -p 5432 -h localhost`

## Database structure

Database schema can be viewed with a MySQL Workbench app and file can be found from [./database/model.mwb](./database/model.mwb)

![Image](./public/database.png?raw=true)

# Rest 

  * https://racerecorder.herokuapp.com/api/tracks - GET - Get all tracks
  * https://racerecorder.herokuapp.com/api/drivers - GET - Get all drivers
  * https://racerecorder.herokuapp.com/api/cars - GET - Get all cars
  * https://racerecorder.herokuapp.com/api/records - GET - Get all recoreds
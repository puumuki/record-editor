import { Pool } from 'pg'

let connection: Pool

if (process.env.DATABASE_URL) {
  connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  connection = new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: parseInt(process.env.PGSQL_PORT!),
    database: process.env.PGSQL_DATABASE
  })
}

export default connection

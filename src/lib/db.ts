import { drizzle } from "drizzle-orm/node-postgres";
import {Pool} from "pg"


//setup database.
console.log("database connection uri",process.env.DATABASE_URL)

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool);
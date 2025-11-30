import pg from "pg"
const {Pool} = pg;

const pool = new Pool({
    host:process.env.SUPABASE_HOST,
    user:"postgres.ejeyipptidxigpipgjfl",
    password:process.env.SUPABASE_PASSWORD,
    database:"postgres",
    port:5432,
    ssl: { rejectUnauthorized: false }
})
console.log(process.env.SUPABASE_HOST)



export default pool;
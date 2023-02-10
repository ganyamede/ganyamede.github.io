const Pool = require("pg").Pool;
const pool = new Pool({
    user: 'postgres',
    password: '999988qq',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
});

pool.query(`CREATE TABLE IF NOT EXISTS news (
    name TEXT,
    description TEXT,
    photo TEXT,
    url TEXT,
    data TEXT,
    view INTEGER
)`)

async function Insert(name, description, photo, url, data) {
        await pool.query(`INSERT INTO news (name, description, photo, url, data, view) VALUES ($1, $2, $3, $4, $5, $6)`, [name, description, photo, url, data, 0]);
}

async function Select() {
    var result = await pool.query(`SELECT * FROM news`);
    return result.rows
}

async function SelectWhere(urls) {
    var result = await pool.query(`SELECT * FROM news WHERE url = '${urls}'`);
    return result.rows
}

async function Update(url) {
    await pool.query(`UPDATE news SET view = view + 1 WHERE url = '${url}'`)
}

async function Delete(url) {
    await pool.query(`DELETE FROM news WHERE url = '${url}'`)
}

async function Edit(name, description, photo, url) {
    await pool.query(`UPDATE news SET name = '${name}' WHERE url = '${url}'`)
    await pool.query(`UPDATE news SET description = '${description}' WHERE url = '${url}'`)
    await pool.query(`UPDATE news SET photo = '${photo}' WHERE url = '${url}'`)
}

module.exports = {Select, SelectWhere, Delete, Edit, Update, Insert, pool}
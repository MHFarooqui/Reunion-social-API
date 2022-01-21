const { Client } = require('pg');
const client = new Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    database: process.env.PG_DB
});
client.connect();
module.exports = client;
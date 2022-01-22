const { Client } = require('pg');
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    }
});
client.connect();
module.exports = client;
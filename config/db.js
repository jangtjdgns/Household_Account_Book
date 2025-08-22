// config/db.js
require('dotenv').config({ path: '/etc/secrets/.env' }); // Render Secret File
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    ssl: { rejectUnauthorized: true } // Aiven MySQL SSL 적용
}).promise();

module.exports = db;
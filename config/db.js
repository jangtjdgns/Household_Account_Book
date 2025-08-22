// config/db.js
require('dotenv').config({ path: '/etc/secrets/.env' }); // Render Secret File
const fs = require('fs');
const mysql = require('mysql2');

// Aiven CA 인증서 경로
const caCertPath = '/etc/secrets/ca.pem';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
    ssl: {
        ca: fs.readFileSync(caCertPath)
    }
}).promise();

module.exports = db;

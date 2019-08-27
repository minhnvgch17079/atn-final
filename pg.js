var dotenv = require('dotenv').config()
var {Pool, Client} = require('pg')
var client = new Client({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    port: process.env.ports
})
client.connect()

module.exports = client
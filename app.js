require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = mongoose.connection;

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
const baseUrl = process.env.NEXT_STATIC_BASE_URL || "http://localhost:8081";
let options = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Request-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
}
app.use(cors(options))

const users = require('./routes/users');
app.use('/user', users);



app.listen(process.env.PORT || 8081)
require('dotenv').config();

module.exports = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,  
  DB_NAME: process.env.DB_NAME,
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
  PORT: parseInt(process.env.PORT, 10) || 3330,
  JWT_SECRET: process.env.JWT_SECRET
};
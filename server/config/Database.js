import { Sequelize } from 'sequelize';

const db = new Sequelize('m-bca', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;

import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Users = db.define(
  'tb_users',
  {
    nama: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    pin: {
      type: DataTypes.INTEGER,
    },
    saldo: {
      type: DataTypes.INTEGER,
    },
    jenis_card: {
      type: DataTypes.STRING,
    },
    no_rek: {
      type: DataTypes.STRING,
    },
    no_card: {
      type: DataTypes.STRING,
    },
    kode_akses: {
      type: DataTypes.STRING,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Users;

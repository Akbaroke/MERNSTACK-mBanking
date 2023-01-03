import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const OtpExpired = db.define(
  'tb_otp',
  {
    email: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.INTEGER,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
    expired: {
      type: DataTypes.STRING,
    },
    limit_request: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default OtpExpired;

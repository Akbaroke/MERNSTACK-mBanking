import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const DaftarTransfer = db.define('tb_daftartransfer',
  {
    id_user: {
      type: DataTypes.INTEGER,
    },
    no_rek: {
      type: DataTypes.STRING,
    },
    bank: {
      type: DataTypes.STRING,
    }
  },
  {
    freezeTableName: true,
  }
);

export default DaftarTransfer;

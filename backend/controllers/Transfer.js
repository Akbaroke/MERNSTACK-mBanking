import Users from '../models/UserModel.js';
import DaftarTransfer from '../models/DaftarTransferModel.js';
import { createRequire } from 'node:module';

// TRANSFER SALDO
export const Transfer = async (req, res) => {
  const { saldoTf, noTujuan } = req.body;
  try {
    // cek norek sudah didaftarkan atau belum
    const cekDataTujuan = await DaftarTransfer.findAll({
      where: {
        no_rek: noTujuan,
      },
    });
    if (!cekDataTujuan) return res.status(404).json({ msg: 'No Rekening Tujuan tidak belum terdaftar...' });

    // ambil data tujuan
    const getDataTujuan = await Users.findAll({
      where: {
        no_rek: noTujuan,
      },
    });

    // cek norek sudah didaftarkan atau belum
    const getDataAsal = await Users.findAll({
      where: {
        id: req.userId,
      },
    });
    if (getDataAsal[0].saldo < parseInt(saldoTf)) return res.status(404).json({ msg: 'Saldo tidak cukup...' });

    // transfer
    const saldoTujuan = parseInt(getDataTujuan[0].saldo) + parseInt(saldoTf);
    await Users.update(
      { saldo: saldoTujuan },
      {
        where: {
          id: getDataTujuan[0].id,
        },
      }
    );

    const saldoAsal = parseInt(getDataAsal[0].saldo) - parseInt(saldoTf);
    await Users.update(
      { saldo: saldoAsal },
      {
        where: {
          id: req.userId,
        },
      }
    );

    res.json({
      msg: 'Transfer Berhasil ...',
      nominal: saldoTf,
      namaPenerima: getDataTujuan[0].nama,
      no_rek: getDataTujuan[0].no_rek,
    });
    console.log(getDataTujuan[0].nama);
  } catch (error) {
    res.status(404).json({ msg: 'Koneksi internet Anda terputus, Silahkan ulangi beberapa saat lagi.' });
    console.log(error);
  }
};

// Cek nomer rekening
export const cekNomerRekening = async (req, res) => {
  const { no_rek } = req.body;
  try {
    // ambil data norek tujuan
    const getDataTujuan = await Users.findOne({
      where: {
        no_rek: no_rek,
      },
      attributes: ['nama', 'no_rek'],
    });
    if (!getDataTujuan) return res.status(404).json({ msg: '107 - Nomor rekening tidak dapat diketahui.' });
    res.json(getDataTujuan);
  } catch (error) {
    res.status(404).json({ msg: 'Koneksi internet Anda terputus, Silahkan ulangi beberapa saat lagi.' });
    console.log(error);
  }
};

// tambah norek antar bank
export const TambahNorekAntarBank = async (req, res) => {
  const { bank, no_rek } = req.body;
  try {
    const cekBank = await DaftarTransfer.findOne({
      where: {
        id_user: req.userId,
        no_rek: no_rek,
        bank: bank,
      },
    });
    if (!cekBank) {
      await DaftarTransfer.create({
        id_user: req.userId,
        no_rek: no_rek,
        bank: bank,
      });
      res.json({ msg: '201 - sukses.' });
    } else {
      res.json({ msg: '202 - sukses.' });
    }
  } catch (error) {
    res.status(404).json({ msg: 'Koneksi internet Anda terputus, Silahkan ulangi beberapa saat lagi.' });
    console.log(error);
  }
};

// tambah norek sesama bank
export const TambahNorekAntarRekening = async (req, res) => {
  const { no_rek } = req.body;
  const bank = 'BCA'; // default bank
  try {
    const cekBank = await DaftarTransfer.findOne({
      where: {
        id_user: req.userId,
        no_rek: no_rek,
        bank: bank,
      },
    });
    if (!cekBank) {
      await DaftarTransfer.create({
        id_user: req.userId,
        no_rek: no_rek,
        bank: bank,
      });
      res.json({ msg: '201 - sukses.' });
    } else {
      res.json({ msg: '202 - sukses.' });
    }
  } catch (error) {
    res.status(404).json({ msg: 'Koneksi internet Anda terputus, Silahkan ulangi beberapa saat lagi.' });
    console.log(error);
  }
};

// ambil list bank lain
export const getListBankLain = async (req, res) => {
  const { bank } = req.body;
  try {
    const getDataBank = await DaftarTransfer.findAll({
      where: {
        id_user: req.userId,
        bank: bank,
      },
      attributes: ['id', 'bank'],
    });
    if (getDataBank == false) return res.status(404).json({ msg: null });
    res.json(getDataBank);
  } catch (error) {
    res.status(404).json({ msg: 'Koneksi internet Anda terputus, Silahkan ulangi beberapa saat lagi.' });
    console.log(error);
  }
};

export const listBank = async (req, res) => {
  const require = createRequire(import.meta.url);
  const dataBank = require('../assets/bank.json');
  res.send(JSON.stringify(dataBank));
};

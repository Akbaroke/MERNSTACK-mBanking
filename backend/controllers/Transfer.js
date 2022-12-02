import Users from '../models/UserModel.js';
import DaftarTransfer from '../models/DaftarTransferModel.js';

// TRANSFER SALDO
export const Transfer = async (req, res) => {
  const { userId, saldoTf, noTujuan } = req.body;
  try {
    // tujuan
    const getDataTujuan = await Users.findAll({
      where: {
        no_rek: noTujuan,
      },
    });
    if (!getDataTujuan) return res.status(404).json({ msg: 'No Rekening Tujuan tidak ditemukan...' });

    // asal
    const getDataAsal = await Users.findAll({
      where: {
        id: userId,
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
          id: userId,
        },
      }
    );

    res.json({
      msg: 'Transfer Berhasil ...',
      nominal: saldoTf,
      namaPenerima: getDataTujuan[0].nama,
      no_rek: getDataTujuan[0].no_rek,
    });
  } catch (error) {
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
    if (!getDataTujuan) return res.status(404).json({ msg: '107 - Nomor rekening bank lain tidak tidak dapat diketahui.' });
    res.json(getDataTujuan);
  } catch (error) {
    res.status(404).json({ msg: 'Koneksi internet Anda terputus, Silahkan ulangi beberapa saat lagi.' });
    console.log(error);
  }
};

// tambah norek bank lain
export const NorekBanklain = async (req, res) => {
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
      res.json({ msg: 'sukses data ditambahkan.' });
    }
    res.json({ msg: 'sukses data sudah ada.' });
  } catch (error) {
    res.status(404).json({ msg: 'Koneksi internet Anda terputus, Silahkan ulangi beberapa saat lagi.' });
    console.log(error);
  }
};

import Users from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getInfoUser = async (req, res) => {
  try {
    const users = await Users.findOne({
      where: {
        id: req.userId,
      },
      attributes: ['id', 'nama', 'saldo', 'jenis_card', 'no_rek', 'no_card', 'pin'],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

// cek email
export const cekEmailAllReady = async (req, res) => {
  const { email } = req.body;
  // cek email
  try {
    const response = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (response) return res.status(404).json({ msg: 'Email sudah terbakai.' });
    res.json({ msg: 'Email belum terbakai.' });
  } catch (error) {
    console.log(error);
  }
};

// REGISTER
export const Register = async (req, res) => {
  const { nama, email, password, confPassword, pin, jenis_card, kode_akses, ip_address } = req.body;

  // cek pasword dan pin
  if (password !== confPassword) return res.status(400).json({ msg: 'Password dan confirm Password tidak sama' });
  if (pin.length !== 6) return res.status(400).json({ msg: 'Pin harus 6 angka' });

  // cek email
  const cekEmail = await Users.findAll({
    where: {
      email: email,
    },
  });
  if (cekEmail[0] != null) return res.status(400).json({ msg: 'Email Sudah digunakan ...' });

  // cek kode akses dan ip address
  const cekDevice = await Users.findAll({
    where: {
      kode_akses: kode_akses,
      ip_address: ip_address,
    },
  });
  if (cekDevice[0] != null) return res.status(400).json({ msg: 'Kode Akses Tidak boleh sama dalam 1 perangkat...' });

  // encrypt password
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  // create no rekening
  let loop1 = true;
  while (loop1 == true) {
    let date = new Date();
    let components = [Math.floor(1 + Math.random() * 9), date.getYear(), Math.floor(1 + Math.random() * 9), date.getMinutes(), Math.floor(1 + Math.random() * 9), date.getSeconds()];
    var no_rek = components.join('');

    // cek no rek
    const cek1 = await Users.findAll({
      where: {
        no_rek: no_rek,
      },
    });
    if (cek1[0] == null) {
      loop1 = false;
    } else {
      loop1 = true;
    }
  }

  // create no card
  let loop2 = true;
  while (loop2 == true) {
    let arr_noCard = [];
    for (let i = 0; i < no_rek.length; i++) {
      arr_noCard.push(no_rek.charAt(i));
    }
    arr_noCard.sort(() => 0.5 - Math.random());
    let joinNumber = arr_noCard.join('');
    let components = [Math.floor(100000 + Math.random() * 900000).toString(), joinNumber];
    var no_card = components.join('');

    // cek no card
    let loop3 = true;
    while (loop3) {
      const cek2 = await Users.findAll({
        where: {
          no_card: no_card,
        },
      });
      if (cek2[0] == null) {
        if (no_card.length == 16) {
          loop2 = false;
          loop3 = false;
        } else if (no_card.length == 15) {
          no_card += '0';
          loop3 = true;
          loop2 = false;
        } else {
          loop3 = false;
          loop2 = true;
        }
      } else {
        loop2 = true;
      }
    }
  }

  // set default saldo
  const saldo = 100000;

  try {
    await Users.create({
      nama: nama,
      email: email,
      password: hashPassword,
      pin: pin,
      saldo: saldo,
      jenis_card: jenis_card,
      no_rek: no_rek,
      no_card: no_card,
      kode_akses: kode_akses,
      ip_address: ip_address,
    });
    res.json({ msg: 'Register Berhasil' });
  } catch (error) {
    console.log(error);
  }
};

// LOGIN
export const Login = async (req, res) => {
  const { kode_akses, ip_address } = req.body;
  try {
    // mencari kode akses user pada db
    const user = await Users.findAll({
      where: {
        kode_akses: kode_akses,
      },
    });
    // setelah kode akses ditemukan lalu cocokan dengan user agentnya
    const match = user[0].ip_address === ip_address;
    if (!match)
      return res
        .status(400)
        .json({ msg: '101 - Perangkat yang digunakan tidak sesuai. Silahkan gunakan Perangkat yang digunakan saat aktivasi atau lakukan verifikasi ulang melalui fitur Verifikasi Ulang BCA mmobile pada menu Ganti Kode Akses.' });

    const userId = user[0].id;
    const nama = user[0].nama;
    const accessToken = jwt.sign({ userId, nama }, process.env.ACCES_TOKEN_SECRET, {
      expiresIn: '20s',
    });
    const refreshToken = jwt.sign({ userId, nama }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    // membuat http only cookie kirim ke client
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true // untuk https
    });
    // kirim res ke client (fenya)
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: 'Kode akses anda salah.' });
  }
};

// LOGOUT
export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

// RESET KODE AKSES
export const ResetKodeAkses = async (req, res) => {
  const { kodeLama, kodeBaru, konfirmKodeBaru, pin, email, ip_address } = req.body;
  try {
    const user = await Users.findAll({
      where: {
        pin: pin,
        kode_akses: kodeLama,
        email: email,
      },
    });
    if (!user[0]) return res.status(404).json({ msg: 'Kode Akses saat ini salah.' });
    if (kodeBaru.length !== 6) return res.status(404).json({ msg: 'Kode Akses baru harus 6 alphanum.' });
    if (kodeBaru !== konfirmKodeBaru) return res.status(404).json({ msg: 'Konfirmasi Password salah.' });
    await Users.update(
      {
        kode_akses: kodeBaru,
        ip_address: ip_address,
      },
      {
        where: {
          email: email,
        },
      }
    );
    res.status(200).json({ msg: 'Kode Akses Berhasil diperbarui.' });
  } catch (error) {
    console.log(error);
  }
};

import Users from '../models/UserModel.js';
import nodemailer from 'nodemailer';
// import bcrypt from 'bcrypt';
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
  const { nama, email, pin, jenis_card, kode_akses, ip_address } = req.body;

  // cek pasword dan pin
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

  // encrypt
  // const salt = await bcrypt.genSalt();
  // const hashPin = await bcrypt.hash(pin, salt);

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

  const generateRandomNumber = () => {
    const result = [];
    for (let i = 0; i < 16; i++) {
      const randomNumber = Math.floor(Math.random() * 10);
      result.push(randomNumber);
    }
    return result.join('');
  };

  // create no card
  let isLoop = true;
  while (isLoop) {
    var no_card = generateRandomNumber();
    const cekDuplicate = await Users.findOne({
      where: {
        no_card: no_card,
      },
    });
    if (cekDuplicate === null || cekDuplicate === undefined) {
      isLoop = false;
    } else {
      isLoop = true;
    }
  }

  // set default saldo
  const saldo = 100000;

  try {
    await Users.create({
      nama: nama,
      email: email,
      pin: hashPin,
      saldo: saldo,
      jenis_card: jenis_card,
      no_rek: no_rek,
      no_card: no_card,
      kode_akses: kode_akses,
      ip_address: ip_address,
    });

    // send Email suksesful
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use TLS
      auth: {
        user: process.env.EMAIL_ADDRESS_BOT,
        pass: process.env.EMAIL_PASSWORD_BOT,
      },
    });

    const linkCardPaspor = {
      blueCard: 'https://cdn.discordapp.com/attachments/1015028360759492710/1060162936921927690/bacBlue.png',
      goldCard: 'https://cdn.discordapp.com/attachments/1015028360759492710/1060237102538834041/gold-email.png',
      platinumCard: 'https://cdn.discordapp.com/attachments/1015028360759492710/1060237102849200180/plat-email.png',
    };

    const formatNoCardSpasi = (nomor) => {
      for (let i = 4; i < nomor.length; i += 5) {
        nomor = nomor.substring(0, i) + ' ' + nomor.substring(i);
      }
      return nomor;
    };

    // define the email options
    const mailOptions = {
      from: '"Register SUKSES" <botprogram123@gmail.com>',
      to: email,
      subject: 'Register SUKSES',
      text: `Register SUKSES`,
      html: `<div style="display: blok; box-sizing: border-box; position: relative; max-width: 585px; height: max-content; border: 1px solid #015a9e; border-radius: 10px; margin: auto; text-align: center; padding: 30px; background-color: #F8F8F8; box-shadow: 4px 4px 4px #00000040;">
      <img src="https://cdn.discordapp.com/attachments/1015028360759492710/1060162936921927690/bacBlue.png" alt="" style="width: 110px; margin-bottom: 4px" />
      <p style="font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-style: italic; font-size: 14px; color: #000; text-transform: capitalize">Hai ${nama},</p>
      <p style="font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-style: italic; font-size: 14px; color: #0074cd; max-width: 326px; margin: 20px auto; line-height: 6mm">
        Selamat Registrasi Pembuatan Rekening BAC mobile BERHASIL terverifikasi
      </p>
      <p style="font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; margin-bottom: 19px">Berikut ini adalah data m-banking kamu :</p>
      <div style="max-width: 188px; height: 115px; position: relative; border-radius: 7px; box-shadow: 2px 2px 4px #00000040; box-sizing: border-box; margin: auto">
        <img style="width: 100%" src="${jenis_card === 'blue' ? linkCardPaspor.blueCard : jenis_card === 'gold' ? linkCardPaspor.goldCard : linkCardPaspor.platinumCard}" alt="card" />
        <p style="position: absolute; bottom: 3px; left: 20px; color: #fff; font-size: 7px; text-transform: uppercase; font-weight: 400; text-shadow: 0.5px 0.5px 1px #444; max-width: 114px; height: max-content; letter-spacing: 0.2mm">
          ${nama}
        </p>
      </div>
      <table style="margin: auto; max-width: 400px; margin-top: 20px; position: relative; right: 0px">
        <tbody style="text-align: center;">
          <tr style="display: flex; justify-content: left; margin-bottom: 6px">
            <td style="width: 120px; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize; text-align: left">Nomer rekening</td>
            <td style="width: 30px; text-align: center; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize">:</td>
            <td style="width: max-content; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize">${no_rek}</td>
          </tr>
          <tr style="display: flex; justify-content: left; margin-bottom: 6px">
            <td style="width: 120px; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize; text-align: left">Kode Akses</td>
            <td style="width: 30px; text-align: center; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize">:</td>
            <td style="width: max-content; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: none">${kode_akses}</td>
          </tr>
          <tr style="display: flex; justify-content: left; margin-bottom: 6px">
            <td style="width: 120px; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize; text-align: left">Jenis Paspor</td>
            <td style="width: 30px; text-align: center; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize">:</td>
            <td style="width: max-content; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize">${jenis_card}</td>
          </tr>
          <tr style="display: flex; justify-content: left; margin-bottom: 6px">
            <td style="width: 120px; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize; text-align: left">Nomor Paspor</td>
            <td style="width: 30px; text-align: center; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize">:</td>
            <td style="width: max-content; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize">${formatNoCardSpasi(no_card)}</td>
          </tr>
          <tr style="display: flex; justify-content: left; margin-bottom: 6px">
            <td style="width: 120px; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize; text-align: left">Saldo</td>
            <td style="width: 30px; text-align: center; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize">:</td>
            <td style="width: max-content; font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; color: #000; text-transform: capitalize">Rp 100,000.00</td>
          </tr>
        </tbody>
      </table>
      <table></table>
      <p style="font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; max-width: 420px; line-height: 7mm; margin: auto; margin-top: 32px; color: #000">
        Silahkan jaga data ini dengan sebaik-baiknya dan JANGAN berikan data ini ke siapa pun
      </p>
      <p style="font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-size: 14px; max-width: 420px; line-height: 7mm; margin: auto; margin-top: 10px; color: #000">TERIMAKASIH.</p>
    </div>`,
    };

    // send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('email sent: %s', info.messageId);

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
      return res.status(400).json({ msg: '101 - Perangkat yang digunakan tidak sesuai. Silahkan gunakan Perangkat yang digunakan saat aktivasi atau lakukan verifikasi ulang melalui fitur Verifikasi Ulang BCA mobile pada menu About.' });

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
    if (kodeLama === kodeBaru) return res.status(404).json({ msg: 'Kode akses lama tidak boleh sama dengan kode akses baru.' });
    if (kodeBaru !== konfirmKodeBaru) return res.status(404).json({ msg: 'Konfirmasi kode baru tidak sama.' });

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

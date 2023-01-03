import nodemailer from 'nodemailer';
import OtpExpired from '../models/OtpExpired.js';

export const sendOtpEmail = async (req, res) => {
  const { emailTo, nama, ip_address } = req.body;

  const generateRandomNumber = () => {
    const result = [];

    for (let i = 0; i < 4; i++) {
      const randomNumber = Math.floor(Math.random() * 10);
      result.push(randomNumber);
    }

    return result.join('');
  };

  const otp = generateRandomNumber();
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use TLS
    auth: {
      user: process.env.EMAIL_ADDRESS_BOT,
      pass: process.env.EMAIL_PASSWORD_BOT,
    },
  });

  // define the email options
  const mailOptions = {
    from: '"Verifikasi OTP" <botprogram123@gmail.com>',
    to: emailTo,
    subject: 'OTP Email',
    text: `Your OTP is: ${otp}`,
    html: `<div style="display: blok; box-sizing: border-box; position: relative; max-width: 585px; height: max-content; border: 1px solid #015a9e; border-radius: 10px; margin: auto; text-align: center; padding: 30px">
    <img src="https://cdn.discordapp.com/attachments/1015028360759492710/1059627735078682734/logobca.png" alt="" style="width: 110px; margin-bottom: 4px" />
    <p style="font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-style: italic; font-size: 14px; color: #000; text-transform: capitalize">Hai ${nama},</p>
    <p style="font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-style: italic; font-size: 14px; color: #000">Kode Verifikasi (OTP) BCA mobile kamu:</p>
    <div style="width: 212px; height: 65px; text-align: center; background-color: #f4f4f4; border: 2px solid #013682; border-radius: 10px; box-sizing: border-box; padding: 6px 25px; margin: auto; margin-top: 30px">
      <p style="color: #013682; font-size: 36px; font-weight: 700; letter-spacing: 7mm; height: max-content; display: contents">${otp}</p>
    </div>
    <p style="font-family: Roboto, Arial, Helvetica, sans-serif; font-weight: 600; font-style: italic; font-size: 14px; max-width: 420px; line-height: 7mm; margin: auto; margin-top: 25px; color: #000">
      Berlaku selama 15 menit. JANGAN BERI kode ini ke siapa pun, TERMASUK ADMIN BCA.
    </p>
  </div>`,
  };

  const date = new Date();
  const timestamp = date.getTime();
  const fifteenSecondsInMilliseconds = 1 * 60 * 1000;
  const fifteenMinutesInMilliseconds = 15 * 60 * 1000;
  const expiredTime = timestamp + fifteenMinutesInMilliseconds;
  const limitRequestTime = timestamp + fifteenSecondsInMilliseconds;

  try {
    // delete all row for expired otp in db
    const getAllOtp = await OtpExpired.findAll();
    getAllOtp.forEach((row) => {
      if (row.expired < timestamp) {
        OtpExpired.destroy({
          where: {
            id: row.id,
          },
        });
      }
    });

    // cek limit request
    const bandRequst = await OtpExpired.findOne({
      where: {
        ip_address: ip_address,
      },
    });

    // format second to minute
    function FormatMinute(valueInSeconds) {
      const minutes = Math.floor(valueInSeconds / 60);
      const seconds = valueInSeconds % 60;
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      return formattedTime;
    }

    // selisih waktu
    function selisih() {
      const date1 = new Date(parseInt(bandRequst.limit_request));
      const date2 = new Date(timestamp);
      const differenceInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
      const differenceInSeconds = differenceInMilliseconds / 1000;
      return differenceInSeconds.toFixed();
    }

    if (bandRequst !== null) {
      if (parseInt(bandRequst.limit_request) > timestamp) {
        return res.status(404).json({ time: parseInt(selisih()) });
      }
      // update expired
      await OtpExpired.update(
        {
          email: emailTo,
          otp: otp,
          expired: expiredTime,
          limit_request: limitRequestTime,
        },
        {
          where: {
            ip_address: ip_address,
            email: emailTo,
          },
        }
      );
    } else {
      // insert otp in db
      await OtpExpired.create({
        email: emailTo,
        otp: otp,
        ip_address: ip_address,
        expired: expiredTime,
        limit_request: limitRequestTime,
      });
    }

    // send the email
    const info = await transporter.sendMail(mailOptions);
    const dataResponse = {
      otp: otp,
      ip_address: ip_address,
      expired: expiredTime,
      limit_request: limitRequestTime,
    };
    res.json(dataResponse);

    console.log('OTP email sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
  }
};

export const cekLimitRequest = async (req, res) => {
  const { ip_address } = req.body;

  const date = new Date();
  const timestamp = date.getTime();

  // delete all row for expired otp in db
  const getAllOtp = await OtpExpired.findAll();
  getAllOtp.forEach((row) => {
    if (row.expired < timestamp) {
      OtpExpired.destroy({
        where: {
          id: row.id,
        },
      });
    }
  });

  // cek limit request
  const bandRequst = await OtpExpired.findOne({
    where: {
      ip_address: ip_address,
    },
  });

  // format second to minute
  function FormatMinute(valueInSeconds) {
    const minutes = Math.floor(valueInSeconds / 60);
    const seconds = valueInSeconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return formattedTime;
  }

  // selisih waktu
  function selisih() {
    const date1 = new Date(parseInt(bandRequst.limit_request));
    const date2 = new Date(timestamp);
    const differenceInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
    const differenceInSeconds = differenceInMilliseconds / 1000;
    return differenceInSeconds.toFixed();
  }

  if (bandRequst !== null) {
    if (parseInt(bandRequst.limit_request) > timestamp) {
      return res.json({ time: parseInt(selisih()) });
    }
  }
  res.json({ time: 0 });
};

export const authOtpEmail = async (req, res) => {
  const { emailTo, otpKode, ip_address } = req.body;

  const getDataOtp = await OtpExpired.findOne({
    where: {
      email: emailTo,
      otp: otpKode,
      ip_address: ip_address,
    },
  });
  if (!getDataOtp) return res.status(404).json({ msg: 'Kode OTP salah.' });

  await OtpExpired.destroy({
    where: {
      email: emailTo,
      otp: otpKode,
      ip_address: ip_address,
    },
  });

  res.json({ msg: 'sukses' });
};

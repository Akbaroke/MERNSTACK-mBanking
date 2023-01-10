import Users from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].id;
      const nama = user[0].nama;
      const saldo = user[0].saldo;
      const accessToken = jwt.sign({ userId, nama, saldo }, process.env.ACCES_TOKEN_SECRET, {
        expiresIn: '10s',
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};

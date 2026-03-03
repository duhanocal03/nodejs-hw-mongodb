const bcrypt = require('bcrypt');
const crypto = require('crypto');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const { transporter } = require('../utils/mailer');
const User = require('../db/models/user');
const Session = require('../db/models/session');

const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const registerUserService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: passwordHash });
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password is wrong');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createHttpError(401, 'Email or password is wrong');

  const userId = user._id.toString();

  await Session.deleteMany({ userId });

  const accessToken = crypto.randomBytes(30).toString('hex');
  const refreshToken = crypto.randomBytes(40).toString('hex');

  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_TTL_MS);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken, refreshTokenValidUntil };
};

const refreshSessionService = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const accessToken = crypto.randomBytes(30).toString('hex');
  const newRefreshToken = crypto.randomBytes(40).toString('hex');

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    refreshTokenValidUntil,
  };
};

const logoutUserService = async (refreshToken) => {
  if (!refreshToken) return;

  await Session.deleteOne({ refreshToken });
};

const sendResetEmailService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Reset password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below (valid for 5 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });
  } catch (err) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.'
    );
  }

  return true;
};

const resetPasswordService = async ({ token, password }) => {
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.updateOne(
    { _id: user._id },
    { password: passwordHash }
  );

  // Bu kullanıcıya ait mevcut oturumları sil
  await Session.deleteMany({ userId: user._id.toString() });

  return true;
};

module.exports = {
  registerUserService,
  loginUserService,
  refreshSessionService,
  logoutUserService,
  sendResetEmailService,
  resetPasswordService
};
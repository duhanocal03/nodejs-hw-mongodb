const bcrypt = require('bcrypt');
const crypto = require('crypto');
const createHttpError = require('http-errors');

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

module.exports = {
  registerUserService,
  loginUserService,
  refreshSessionService,
  logoutUserService
};
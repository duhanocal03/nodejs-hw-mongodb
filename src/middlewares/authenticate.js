const createHttpError = require('http-errors');

const Session = require('../db/models/session');
const User = require('../db/models/user');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization header var mı?
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  // Bearer token mı?
  const [bearer, accessToken] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Invalid authorization header'));
  }

  // session bul
  const session = await Session.findOne({ accessToken });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  // access token süresi kontrol
  if (new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  // kullanıcıyı bul
  const user = await User.findById(session.userId);

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  // request'e ekle
  req.user = user;

  next();
};

module.exports = authenticate;
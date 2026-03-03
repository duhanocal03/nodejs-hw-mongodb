const { registerUserService,
        loginUserService,
        refreshSessionService,
        sendResetEmailService, 
        resetPasswordService, 
} = require('../services/auth');
const { logoutUserService } = require('../services/auth');


const register = async (req, res) => {
  const user = await registerUserService(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

const login = async (req, res) => {
  const { accessToken, refreshToken, refreshTokenValidUntil } =
    await loginUserService(req.body);

  // refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
    sameSite: 'strict',
    // secure: true, // Render/HTTPS'te aç (prod)
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const { accessToken, newRefreshToken, refreshTokenValidUntil } =
    await refreshSessionService(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
    sameSite: 'strict',
    // secure: true, // Render/HTTPS'te aç (prod)
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  await logoutUserService(refreshToken);

  // cookie'yi temizle
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

  res.status(204).send();
};

const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  await sendResetEmailService(email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

const resetPassword = async (req, res) => {
  await resetPasswordService(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};


module.exports = { register, login, refresh,logout,sendResetEmail, resetPassword };
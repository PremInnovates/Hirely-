// services/authService.js
// Thin wrapper around the /api/auth endpoints. AuthContext calls these
// functions rather than hitting `api` directly, so every other part of
// the app only ever talks to AuthContext (via useAuth()), never to Axios
// or endpoint paths directly.

import api from './api';

const register = async ({ name, businessName, email, phone, password, confirmPassword, role }) => {
  const { data } = await api.post('/auth/register', {
    name,
    businessName,
    email,
    phone,
    password,
    confirmPassword,
    role,
  });
  return data; // { success, message, token, user }
};

const login = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data; // { success, message, token, user }
};

const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};

export default { register, login, getMe };

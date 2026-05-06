import client from './client';

export const listUsers = async (search = '') => {
  const params = search ? { username: search } : {};
  const { data } = await client.get('/radius/users/with-meta', { params });
  return data;
};

export const getUser = async (username) => {
  const { data } = await client.get(`/radius/users/with-meta/${encodeURIComponent(username)}`);
  return data;
};

export const createUser = async (user) => {
  const { data } = await client.post('/radius/users/with-meta', user);
  return data;
};

export const updateUser = async (username, updates) => {
  const { data } = await client.put(`/radius/users/with-meta/${encodeURIComponent(username)}`, updates);
  return data;
};

export const deleteUser = async (username) => {
  await client.delete(`/radius/users/with-meta/${encodeURIComponent(username)}`);
};

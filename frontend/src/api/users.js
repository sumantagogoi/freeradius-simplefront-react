import client from './client';

export const listUsers = async (search = '') => {
  const params = search ? { username: search } : {};
  const { data } = await client.get('/radius/users', { params });
  return data;
};

export const createUser = async (user) => {
  const { data } = await client.post('/radius/users', {
    username: user.username,
    attribute: 'Cleartext-Password',
    op: ':=',
    value: user.password,
  });
  return data;
};

export const updateUser = async (id, updates) => {
  const { data } = await client.put(`/radius/users/${id}`, updates);
  return data;
};

export const deleteUser = async (id) => {
  await client.delete(`/radius/users/${id}`);
};

import client from './client';

export const getStats = async () => {
  // Get all users, we'll compute stats from the list
  const { data } = await client.get('/radius/users');
  return {
    totalUsers: data.length,
  };
};

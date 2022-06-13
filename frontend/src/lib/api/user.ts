import client from 'lib/api/client';

// ユーザー全員の情報を取得する
export const getUsers = () => {
  return client.get('users');
}

//  ユーザー個別の情報を取得する
export const getUser = (id: string | undefined) => {
  return client.get(`users/${id}`);
}
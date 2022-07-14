import client from 'lib/api/client';
import Cookies from 'js-cookie';

// ユーザー全員の情報を取得する
export const getUsers = () => {
  return client.get('users');
}

//  ユーザー個別の情報を取得する
export const getUser = (id: string | undefined) => {
  return client.get(`users/${id}`);
}

// ユーザー情報を更新する
export const updateUser = (id: string, data:FormData) => {
  return client.put(`users/${id}`, data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
      'Content-Type': 'multipart/form-data'
    }
  })
}
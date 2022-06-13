import client from 'lib/api/client';
import Cookies from 'js-cookie';

// 画像データをアップロードする
export const uploadImage = (data: FormData) => {
  return client.post('images', data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
      'Content-Type': 'multipart/form-data'
    }
  });
}
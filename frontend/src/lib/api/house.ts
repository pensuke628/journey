import client from 'lib/api/client';
import Cookies from 'js-cookie';

// 全ての施設情報を取得する
export const getHouses = () => {
  return client.get('houses');
}

// 施設情報を作成する 
export const createHouse = (data: FormData) => {
  return client.post('houses', data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
      'Content-Type': 'multipart/form-data',
    }
  })
}

//  特定施設の情報を取得する
export const getHouse = (id: string | undefined) => {
  return client.get(`houses/${id}`);
}

// 施設情報を更新する
export const updateHouse = (id: string, data: FormData) => {
  return client.put(`houses/${id}`, data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 施設を削除する
export const destroyHouse = ( id: string ) => {
  return client.delete(`houses/${id}`, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}
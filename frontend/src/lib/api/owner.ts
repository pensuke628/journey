import client from 'lib/api/client';
import Cookies from 'js-cookie';

import { Owner, DeleteRequest } from 'interfaces/index'

// 自分がオーナーである施設情報を取得する
export const getOwners = () => {
  return client.get('owners', {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  });
}

// 施設のオーナーになる
export const createOwner = (data: Owner) => {
  return client.post('owners', data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  });
}

// 口コミ削除を依頼する
export const deleteRequest = (data: DeleteRequest) => {
  return client.post('owners/delete_request', data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  });
}
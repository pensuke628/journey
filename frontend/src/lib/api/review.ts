import client from 'lib/api/client';
import Cookies from 'js-cookie';

import { ReviewParams } from 'interfaces/index';

export const getReview = (id: string | undefined) => {
  return client.get(`reviews/${id}`)
}

// 口コミを作成する
export const createReview = (data: ReviewParams) => {
  return client.post('reviews', data, {
      headers: {
        'access-token': Cookies.get('_access_token') || '',
        'client': Cookies.get('_client') || '',
        'uid': Cookies.get('_uid') || '',
      }
    }
  );
}

// 口コミの内容を更新する
export const updateReview = (id: string | undefined, data: FormData) => {
  return client.put(`reviews/${id}`, data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}

// 口コミを削除する
export const destroyReview = ( id: string | undefined ) => {
  return client.delete(`reviews/${id}`, {
      headers: {
        'access-token': Cookies.get('_access_token') || '',
        'client': Cookies.get('_client') || '',
        'uid': Cookies.get('_uid') || '',
      }
    }
  )
}
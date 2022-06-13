import client from 'lib/api/client';
import Cookies from 'js-cookie';

import { Follow } from 'interfaces/index';

//  ユーザーをフォローする
export const follow = (data: Follow) => {
  return client.post('relationships', data, {
      headers: {
        'access-token': Cookies.get('_access_token') || '',
        'client': Cookies.get('_client') || '',
        'uid': Cookies.get('_uid') || '',
      }
    }
  );
}

// フォローを解除する
export const unfollow = (data: Follow) => {
  return client.delete(`relationships/unfollow`, {
            data: { data },
            headers: {
              'access-token': Cookies.get('_access_token') || '',
              'client': Cookies.get('_client') || '',
              'uid': Cookies.get('_uid') || '',
            }
         }
        )
}

// フォローしているユーザー&フォローされているユーザーのidを取得する
export const getFollowing = () => {
  return client.get('relationships', {headers: {
    'access-token': Cookies.get('_access_token') || '',
    'client': Cookies.get('_client') || '',
    'uid': Cookies.get('_uid') || ''
  }})
}
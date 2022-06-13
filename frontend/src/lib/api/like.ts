import client from 'lib/api/client';
import Cookies from 'js-cookie';

import { Like } from 'interfaces/index';

export const getLike = () => {
  return client.get('likes', {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  });
}

// 口コミをいいねする
export const like = (data: Like) => {
  return client.post('likes', data, {
      headers: {
        'access-token': Cookies.get('_access_token') || '',
        'client': Cookies.get('_client') || '',
        'uid': Cookies.get('_uid') || '',
      }
    }
  );
}

// いいねを取り消す
export const unlike = (data: Like) => {
  return client.delete(`likes`, {
            data: { data },
            headers: {
              'access-token': Cookies.get('_access_token') || '',
              'client': Cookies.get('_client') || '',
              'uid': Cookies.get('_uid') || '',
            }
          }
         );
}
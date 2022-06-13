import client from 'lib/api/client';
import Cookies from 'js-cookie';

import { Message } from 'interfaces/index';

// メッセージを作成する
export const createMessage = (data: Message) => {
  return client.post('messages', data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}
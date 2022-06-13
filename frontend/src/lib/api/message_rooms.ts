import client from 'lib/api/client';
import Cookies from 'js-cookie';

// 全てのメッセージルーム情報を取得
export const getMessageRooms = () => {
  return client.get('message_rooms', {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}

// 個別のメッセージルームの情報を取得
export const getMessageRoom = (id: number) => {
  return client.get(`message_rooms/${id}`, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}
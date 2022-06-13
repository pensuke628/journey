import client from 'lib/api/client';
import Cookies from 'js-cookie';
import { Bookmark } from 'interfaces/index';

// お気に入り済み施設一覧を取得する
export const getBookmark = () => {
  return client.get('bookmarks', {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}

// 施設をお気に入りする
export const createBookmark = (data: Bookmark) => {
  return client.post('bookmarks', data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  });
}

// お気に入りを解除する
export const destroyBookmark = (data: Bookmark) => {
  return client.delete(`bookmarks`, {
    data: { data },
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
 });
}
import client from 'lib/api/client';
import Cookies from 'js-cookie';

import { Comment, CommentUpdateParams } from 'interfaces/index'

// コメントを作成する
export const createComment = (data: Comment) => {
  return client.post('comments', data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}

// コメント内容を修正する
export const updateComment = (id: number | undefined, data: CommentUpdateParams) => {
  return client.put(`comments/${id}`, data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}

// コメントを削除する
export const destroyComment = (id: number | undefined) => {
  return client.delete(`comments/${id}`, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}
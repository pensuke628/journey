import client from 'lib/api/client';
import Cookies from 'js-cookie';

import { Notification } from 'interfaces/index';

// 自分宛の全ての通知を取得
export const getNotifications = () => {
  return client.get('notifications', {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  })
}

export const createNotification = (data: Notification) => {
  return client.post('notifications', data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  });
}

export const followerNotification = (data: Notification) => {
  return client.post('notifications/follower_notification', data, {
    headers: {
      'access-token': Cookies.get('_access_token') || '',
      'client': Cookies.get('_client') || '',
      'uid': Cookies.get('_uid') || '',
    }
  });
}
import client from 'lib/api/client';

import { TagSearch } from 'interfaces';

// 施設をタグ検索する
export const getTaggedHouses = (data: TagSearch) => {
  return client.get('tags/searchhouses', {
    params: data
  });
}

// 口コミをタグ検索する
export const getTaggedReviews = (data: any) => {
  return client.get('tags/searchreviews', {
    params: data
  });
}
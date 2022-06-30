import client from 'lib/api/client';

import { TagSearch } from 'interfaces';

export const getTaggedHouses = (data: TagSearch) => {
  return client.get('tags/searchhouses', {
    params: data
  });
}

export const getTaggedReviews = (data: any) => {
  return client.get('tags/searchreviews', data)
}
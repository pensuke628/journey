import client from 'lib/api/client';

// 全ての施設情報を取得する
export const getHouses = () => {
  return client.get('houses');
}

//  特定施設の情報を取得する
export const getHouse = (id: string | undefined) => {
  return client.get(`houses/${id}`);
}
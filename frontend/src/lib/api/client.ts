import applyCaseMiddleware from 'axios-case-converter';
import axios from 'axios';

// ヘッダーに関しては適用を無視するオプションを追加
const options = {
  ignoreHeaders: true
};

const client = applyCaseMiddleware(axios.create({
  baseURL: process.env.REACT_APP_ENV === 'production' ? 'https://backend.journey-enjoy.com/api/v1' : 'http://localhost:3010/api/v1'
}), options);

export default client
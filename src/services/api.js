import { stringify } from 'qs';
import { post, get } from '../dvapack/request';

export async function fakeAccountLogin(params) {
  const result = await post('/api/rest/Author/IsLogins/', params, null);
  return result === null ? { data: null } : result;
}


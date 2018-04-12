import request from '../utils/request';
import { post } from '../dvapack/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function changepwd(params) {
  const body = {
    UserPwdOld: params.oldpassword,
    UserPwdNew: params.password,
    UserPwdTwo: params.confirm,
  };
  const result = post('/api/rest/Author/ResetPwd', body, null);
  return result === null ? { data: null } : result;
}


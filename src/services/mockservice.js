import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/mockapi/project/notice');
}

export async function queryActivities() {
  return request('/mockapi/activities');
}

export async function queryRule(params) {
  return request(`/mockapi/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/mockapi/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/mockapi/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/mockapi/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/mockapi/fake_chart_data');
}

export async function queryTags() {
  return request('/mockapi/tags');
}

export async function queryBasicProfile() {
  return request('/mockapi/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/mockapi/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/mockapi/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/mockapi/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/mockapi/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/mockapi/notices');
}

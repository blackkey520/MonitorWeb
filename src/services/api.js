import { stringify } from 'qs';
import { post, get } from '../dvapack/request';

export async function fakeAccountLogin(params) {
  const body = {
    User_Name: params.User_Account,
    USer_Pwd: params.User_Pwd,
  };
  const result = await post('/api/rest/Author/IsLogins/', body, null, 'notooken');

  return result === null ? { data: null } : result;
}
export async function loadPollutantType(params) {
  const result = await get('/api/rest/MenuInfo/GetPolluntType/', {}, null);
  return result === null ? { data: null } : result;
}

export async function loadMonitoroverView(params) {
  const body = {
    pollutantType: params.pollutantType,
    searchTime: '2018-01-04 10:00:00',
    GroupId: '',
  };
  let url;
  if (params.monitortype === 'realtime') {
    url = '/api/rest/OutputAsPointApi/GetPointNewRealTimeDataByPollutantType/';
  } else if (params.monitortype === 'minute') {
    url = '/api/rest/OutputAsPointApi/GetPointNewMinuteDataByPollutantType/';
  } else if (params.monitortype === 'hour') {
    url = '/api/rest/OutputAsPointApi/GetPointNewHourDataByPollutantType/';
  } else if (params.monitortype === 'day') {
    url = '/api/rest/OutputAsPointApi/GetPointNewDayDataByPollutantType/';
  }
  const result = await get(url, body, null);
  return result;
}
export async function loadPollutant(params) {
  const body = {
    pollutantType: params.pollutantType,
  };
  const result = await get('/api/rest/OutputAsPointApi/GetPollutantCodes/', body, null);
  return result;
}
export async function loadMonitorPoint(params) {
  const body = {
    pollutantType: params.pollutantType,
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
  };
  const result = await get('/api/rest/OutputAsPointApi/GetPointsByPollutantType/', body, null);
  return result;
}

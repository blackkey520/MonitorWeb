import { post, get } from '../dvapack/request';
import moment from 'moment';

export async function fakeAccountLogin(params) {
  const body = {
    User_Name: params.User_Account,
    USer_Pwd: params.User_Pwd,
  };
  const result = await post('/api/rest/Author/IsLogins/', body, null, 'notooken');

  return result === null ? { data: null } : result;
}
export async function loadPollutantType() {
  const result = await get('/api/rest/MenuInfo/GetPolluntType/', {}, null);
  return result === null ? { data: null } : result;
}
export async function loadLastdata(params) {
  const body = {
    dgimn: params.dgimn,
  };
  const result = await get('/api/rest/OutputAsPointApi/GetPointNewRealTimeData/', body, null);
  return result === null ? { data: null } : result;
}

export async function maploadMonitorDatalist(params)
{
      let result=[];
      for(let i=0;i<params.mnlist.length;i++)
      {
        const body = {
          DGIMN: params.mnlist[i],
          BeginTime: params.BeginTime,
          EndTime: params.EndTime,
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
          pointType:params.pointType,
          New:""
        };
        if(params.PollutantCode)
        {
          body.PollutantCode=params.PollutantCode;
        }
        let url = '';
        if (params.dataType === 'realtime') {
          url = '/api/rest/RealTime/GetRealTimeData/';
        } else if (params.dataType === 'minute') {
          url = '/api/rest/Minute/GetMinuteData/';
        } else if (params.dataType === 'hour'  ) {
          url = '/api/rest/Hour/GetHourSinglePollutantData/';
        } else if (params.dataType === 'day'  ) {
          url = '/api/rest/Day/GetDaySinglePollutantData/';
        }
        const resultdata = await get(url, body, null);
        result=result.concat(resultdata.data);
      }
        return result;
}

export async function loadMonitorDatalist(params) {
  const body = {
    DGIMN: params.DGIMN,
    BeginTime: params.BeginTime,
    EndTime: params.EndTime,
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    pointType:params.pointType,
    New:""
  };
  if(params.PollutantCode)
  {
    body.PollutantCode=params.PollutantCode;
  }
   
  let url = '';
  if (params.dataType === 'realtime') {
    url = '/api/rest/RealTime/GetRealTimeData/';
  } else if (params.dataType === 'minute') {
    url = '/api/rest/Minute/GetMinuteData/';
  } else if (params.dataType === 'hour'  ) {
    url = '/api/rest/Hour/GetHourSinglePollutantData/';
  } else if (params.dataType === 'day'  ) {
    url = '/api/rest/Day/GetDaySinglePollutantData/';
  }
  const result = await get(url, body, null);
  return result;
}

export async function loadCountryMonitorDatalist(params) {
  const body = {
    MNlist: params.DGIMN,
    BeginTime: params.BeginTime,
    EndTime: params.EndTime,
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    pointType:params.pointType,
    New:""
  };
  if(params.PollutantCode)
  {
    body.PollutantCode=params.PollutantCode;
  }
  let url = '';
   if (params.dataType === 'hour') {
    url = '/api/rest/Hour/GetHourSinglePollutantData/';
  } else if (params.dataType === 'day') {
    url = '/api/rest/Day/GetDaySinglePollutantData/';
  }
    
  const result = await get(url, body, null);
  return result;
}

export async function loadMonitoroverView(params) {
 
  const body = {
    pollutantType: params.pollutantType,
    GroupId: '',
    regionCode:params.regionCode,
    keyWords:params.keyWords,
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
export async function loadPointDetail(params) {
  const body = {
    dgimn: params.dgimn,
    fileLength: params.fileLength,
    width: params.width,
    height: '',
  };
  const result = await get('/api/rest/OutputAsPointApi/GetPointBaseInfo/', body, null);
  return result;
}
export async function loadCountryPointView(params) {
  if(!params.DGIMN)
  params.DGIMN="";
  const body = {
    SearchTime:'',
    GroupID:params.GroupID,
    AQI:'',
    PrimaryPollutantCode:'',
    DGIMN:params.DGIMN,
    New:""
  };
  let url;
  if (params.monitortype === 'minute') {
    url = '/api/rest/ControlData/GetLastHourData/';
  } else if (params.monitortype === 'hour') {
    url = '/api/rest/ControlData/GetLastHourData/';
  } else if (params.monitortype === 'day') {
    url = '/api/rest/ControlData/GetLastDayData/';
  }else{
    return null;
  }
  const result = await get(url, body, null);
  return result;
}

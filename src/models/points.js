import moment from 'moment';
import { loadMonitorPoint, loadLastdata, loadMonitorDatalist, loadPointDetail } from '../services/api';
import { Model } from '../dvapack';


export default Model.extend({
  namespace: 'points',
  state: {
    pointlist: [],
    lastdata: [],
    pollutant: {},
    hourtendency: [],
    selectpoint: [],
    selpoint: null,
    columns: [],
    data: [],
    total: 0,
    size: 30,
    current: 1,
    querydate: [],
    monitortype:  'realtime',
    selpollutant: null,
    dateformat: 'YYYY-MM-DD HH:mm:ss',
  },
  effects: {
    * querypointdetail({
      payload,
    }, { call, update, put }) {
      const { data } = yield call(loadPointDetail, { dgimn: payload.DGIMN, fileLength: 50000, width: 300 });
      yield update({ selpoint: data });
        yield put({
          type: 'querypointdata',
          payload: { dgimn: payload.DGIMN, 
            pollutant: data.PollutantTypeInfo[0].PolluntCode, 
            querydate:  payload.pointType=="monitorData"?[moment().add(-30, 'm'), moment()]:[moment().add(-24, 'h'), moment()],
            monitortype: payload.pointType=="monitorData"?"realtime":"hour",
            pointType:payload.pointType,
            current: 1, 
            dateformat: 'YYYY-MM-DD HH:mm:ss' },
        });
    },
    * querypointdata({
      payload,
    }, { call, update, put, select }) {
      
      const { size } = yield select(_ => _.points);
       
      const pointType=payload.pointType;
      const PollutantCode=payload.pollutant;
      const result = yield call(loadMonitorDatalist, { 
        PollutantCode: payload.pollutant,
        DGIMN: payload.dgimn,
        BeginTime: payload.querydate[0].format(payload.dateformat),
        EndTime: payload.querydate[1].format(payload.dateformat),
        pageIndex: payload.current,
        pageSize: size,
        dataType: payload.monitortype,
        pointType:payload.pointType,
      });
      let resultdata = [];
      const resultda = [];
      if (result.data !== null)
      {
        result.data.map((item, key) => {
          if (payload.monitortype === 'realtime')
          {
            resultda.push(item);
          } else if (payload.monitortype === 'minute')
          {
            item.MonitorValue = item.AvgValue;
            resultda.push(item);
          } else if (payload.monitortype === 'hour' && pointType!="country")
          {
            item.MonitorValue = item.AvgValue;
            item.MonitorTime = moment(item.MonitorTime).format('YYYY-MM-DD HH');
            resultda.push(item);
          }
          else if (payload.monitortype === 'day' && pointType!="country")
          {
            item.MonitorValue = item.AvgValue;
            item.MonitorTime = moment(item.MonitorTime).format('YYYY-MM-DD');
            resultda.push(item);
          }
          else if(payload.monitortype === 'hour' && pointType=="country")
          {
             item.MonitorValue = item[PollutantCode];
             item.MonitorTime = moment(item.MonitorTime).format('YYYY-MM-DD HH');
             resultda.push(item);
          }
          else if(payload.monitortype === 'day' && pointType=="country")
          {
            item.MonitorValue = item[PollutantCode];
            item.MonitorTime = moment(item.MonitorTime).format('YYYY-MM-DD');
            resultda.push(item); 
          }

        });
        
      }


      

      if (payload.current != 1) {
        const { data } = yield select(_ => _.points);
        resultdata = data.concat(resultda);
      } else {
        resultdata = resultda;
      }
      yield update({ data: resultdata, total: result.total, current: payload.current, querydate: payload.querydate, monitortype: payload.monitortype, selpollutant: payload.pollutant, dateformat: payload.dateformat });
    },
    * querypointlastdata({
      payload,
    }, { call, update, put }) {
      const { data: { RealtimeData: lastdata } } = yield call(loadLastdata, { dgimn: payload.itemdata.dgimn });
      yield update({
        selectpoint: payload.itemdata,
        lastdata,
      });
      if (lastdata[0]) {
        yield put({ type: 'queryhourtendency', payload: { pollutant: { PollutantCode: lastdata[0].PollutantCode, PollutantName: lastdata[0].PollutantName, Unit: lastdata[0].Unit } } });
      }
    },
    * queryhourtendency({
      payload,
    }, { call, select, update }) {
      const { selectpoint } = yield select(_ => _.points);
      const result = yield call(loadMonitorDatalist, { PollutantCode: payload.pollutant.PollutantCode,
        DGIMN: selectpoint.dgimn,
        BeginTime: moment().add(-12, 'hours').format('YYYY-MM-DD HH:00:00'),
        EndTime: moment().add(1, 'hours').format('YYYY-MM-DD HH:00:00'),
        pageIndex: 1,
        pageSize: 1000,
        dataType: 'hour',
      });
      const hourtendency = [];
      if (result.data) {
        result.data.map((item, key) => {
          hourtendency.push({
            x: moment(item.MonitorTime).format('YYYY-MM-DD HH:00:00'),
            y: item.AvgValue,
          });
        });
      }
      yield update({
        hourtendency,
        pollutant: payload.pollutant,
      });
    },
    * querymonitorpoint({
      payload,
    }, { call, select, update }) {
      const { pollutanttype } = yield select(_ => _.global);
      if (payload.pollutantType == null) {
        payload.pollutantType = pollutanttype[0].ID;
      }
      const result = yield call(loadMonitorPoint, payload);
      const pointlist = result.data;
      yield update({ pointlist });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, payload }) => {
        if (pathname === '/monitor/map') {
          const {
            pollutantType = null,
            pageIndex = 1,
            pageSize = 10000,
          } = payload || {};
          if (!payload) {
            dispatch({
              type: 'querymonitorpoint',
              payload: {
                pollutantType,
                pageIndex,
                pageSize,
              },
            });
          }
        }
      });
    },
  },
});

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
    showdetail: false,
    selpoint: null,
  },
  reducers: {
    hidedetail(state, { payload }) {
      return {
        ...state,
        showdetail: false,
      };
    },
  },
  effects: {
    * querypointdetail({
      payload,
    }, { call, update, put }) {
      const { data } = yield call(loadPointDetail, { dgimn: payload.DGIMN, fileLength: 50000, width: 300 });
      yield update({ selpoint: data, showdetail: true });
    },
    * querypointlastdata({
      payload,
    }, { call, update, put }) {
      const { data: { RealtimeData: lastdata } } = yield call(loadLastdata, { dgimn: payload.itemdata.dgimn });

      yield update({
        selectpoint: payload.itemdata,
        lastdata,
      });
      yield put({ type: 'queryhourtendency', payload: { pollutant: { PollutantCode: lastdata[0].PollutantCode, PollutantName: lastdata[0].PollutantName, Unit: lastdata[0].Unit } } });
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
      result.data.map((item, key) => {
        hourtendency.push({
          x: moment(item.MonitorTime).format('YYYY-MM-DD HH:00:00'),
          y: item.AvgValue,
        });
      });
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

import { loadMonitorPoint } from '../services/api';
import { Model } from '../dvapack';

export default Model.extend({
  namespace: 'points',
  state: {
    pointlist: [],
  },
  effects: {
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
    } },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, payload }) => {
        if (pathname === '/map') {
          const {
            pollutantType = null,
            pageIndex = 1,
            pageSize = 10000,
          } = payload || {};
          dispatch({
            type: 'querymonitorpoint',
            payload: {
              pollutantType,
              pageIndex,
              pageSize,
            },
          });
        }
      });
    },
  },
});

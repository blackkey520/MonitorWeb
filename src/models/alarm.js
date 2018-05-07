import { Model } from '../dvapack';
import { getTimeDistance } from '../utils/utils';
import { GetAlarmHistoryList } from '../services/api';
import { debug } from 'util';
import { Link } from 'dva/router';

export default Model.extend({
  namespace: 'alarm',
  state: {
    data: [],
  },
  effects: {
    *fetchPolluantType(_, { call, put, update }) {
      const pollutanttyperesult = yield call(loadPollutantType);
      const pollutanttype = pollutanttyperesult.data;
      yield update({ pollutanttype });
    },
    *getAlarmHistoryList({ payload }, { call, put, update }) {
      const data = yield call(GetAlarmHistoryList, payload);
      yield update({ data });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
});
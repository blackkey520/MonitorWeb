import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';

import { fakeAccountLogin } from '../services/api';
import { Model } from '../dvapack';


export default Model.extend({
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put, take }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: { status: response.requstresult === '1' ? 'ok' : 'faild' },
      });
      // Login successfully
      if (response.requstresult === '1') {
        Cookie.set('token', response.data);
        yield put({ type: 'global/fetchPolluantType', payload: { } });
        yield take('global/fetchPolluantType/@@end');
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      Cookie.remove('token');
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
});

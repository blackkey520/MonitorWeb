import Cookie from 'js-cookie';
import { query as queryUsers, queryCurrent, changepwd } from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
    changepwdRes:"",
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchCurrent(_, { put }) {
      const response = Cookie.get('token');
      if (response) {
        const user = JSON.parse(response);

        yield put({
          type: 'saveCurrentUser',
          payload: user,
        });
      }
    },
    *changepwd({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = Cookie.get('token');
      if (response) {
        const user = JSON.parse(response);
        const res = yield call(changepwd, payload);
        yield put({
          type: 'saveChangePwdRes',
          payload: res.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveChangePwdRes(state, action) {
      return {
        ...state,
        changepwdRes: action.payload,
      };
    },

  },
};

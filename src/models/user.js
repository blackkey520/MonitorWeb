import Cookie from 'js-cookie';
import { query as queryUsers, queryCurrent, changepwd } from '../services/user';
import {  message  } from 'antd';

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
    *changepwd({ payload }, { call, put,update,select }) {
      const response = Cookie.get('token');
      if (response) {
        const user = JSON.parse(response);
        const res = yield call(changepwd, payload);
        yield put({
          type: 'saveChangePwdRes',
          payload: res.data,
        });
        const changepwdResStr = yield select(state => state.user.changepwdRes);
        if (changepwdResStr.includes('成功')) {
          message.info('密码修改成功,请重新登录！');
          yield put({
            type: 'login/logout',
          });
        }
        else if (changepwdResStr.includes('原始密码') || changepwdResStr.includes('旧密码') || changepwdResStr.includes('老密码')) {
          message.info('旧密码输入错误！');
        } else {
          message.info('密码修改失败,请稍后重试！');
        }
      }
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

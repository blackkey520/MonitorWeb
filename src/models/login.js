import { routerRedux } from 'dva/router'
import { login } from 'services/login'
import Cookie from 'js-cookie'
export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({
      payload,
    }, { put, call, select }) {

      const data = yield call(login, payload)

      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        Cookie.set('token', data.data);
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    },
  },

}

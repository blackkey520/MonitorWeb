import modelExtend from 'dva-model-extend'
import { loadmonitorpoint } from 'services/monitorpoint'
import { model } from 'models/common'
import { Icon } from 'antd'

export default modelExtend(model, {
  namespace: 'monitorpoint',
  state: {
    pointlist: [],
  },
  reducers: {
    changeState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
    * querymonitorpoint ({
            payload,
        }, { put, call, select }) {
      const { pollutanttype } = yield select(_ => _.app) 
      if (payload.pollutantType == null) {
        payload.pollutantType = pollutanttype[0].ID
      }
      const result = yield call(loadmonitorpoint, payload)
      const pointlist = result.data
      yield put({
        type: 'changeState',
        payload: {
          pointlist,
        },
      })
    } },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, payload }) => {
        if (pathname === '/monitormapview') {
          const {
                    pollutantType = null,
                    pageIndex = 1,
                    pageSize = 10000,
                } = payload || {}
          dispatch({
            type: 'querymonitorpoint',
            payload: {
              pollutantType,
              pageIndex,
              pageSize,
            },
          })
        }
      })
    },
  },
})


import modelExtend from 'dva-model-extend'
import { loadmonitoroverview, loadpollutant } from 'services/monitoroverview'
import { model } from 'models/common'
import { Icon } from 'antd'
import * as appService from 'services/app'

export default modelExtend(model, {
  namespace: 'monitoroverview',
  state: {
    columns: [],
    data: [],
  },
  reducers: {
    changeState (state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    * querydata ({
      payload,
    }, { put, call, select }) {
      const pollutanttyperesult = yield call(appService.loadpollutanttype)
      const pollutanttype = pollutanttyperesult.data
      if (payload.pollutantType == null) {
        payload.pollutantType = pollutanttype[0].ID
      }
      const columnpollutant = yield call(loadpollutant, payload)
      let columns = [
        {
          title: '状态',
          width: 50,
          dataIndex: 'status',
          key: 'status',
          fixed: 'left',
          render: text => < Icon type="laptop" style={{ fontSize: 16, color: text === 0 ? '#b0b0b1' : text === 1 ? '#66a404' : text === 2 ? '#ff0000' : '#b9c305' }} />,
        },
        {
          title: '监测点',
          width: 200,
          dataIndex: 'point',
          key: 'point',
          fixed: 'left',
        },
        {
          title: '监测时间',
          width: 180,
          dataIndex: 'datetime',
          key: 'datetime',
          fixed: 'left',
        },
      ]
      columnpollutant.data.map((item, key) => {
        columns.push({
          title: `${item.PollutantName}[${item.Unit}]`,
          width: 100,
          dataIndex: item.PollutantCode,
          key: item.PollutantCode,
          render: text => <span style={{ color: text ? text.split('|')[1] : '#666666' }}>{text ? text.split('|')[0] : '-'}</span >,
        })
      })
      const result = yield call(loadmonitoroverview, payload)
      let data = []
      result.data.map((item, key) => {
        let dataitem = {}

        columns.map((columnsitem, columnskey) => {
          if (columnskey === 0) {
            dataitem[columnsitem.key] = item.status
          } else if (columnskey === 1) {
            dataitem[columnsitem.key] = `${item.pname}-${item.text}`
          } else if (columnskey === 2) {
            dataitem[columnsitem.key] = item.Times
          } else {
            dataitem[columnsitem.key] = item.Values[columnskey - 3]
? `${item.Values[columnskey - 3]}|${item.Colors[columnskey - 3]}`
  : '-'
          }
        })
        dataitem.key = key
        data.push(dataitem)
      })
      if (result) {
        yield put({
          type: 'changeState',
          payload: {
            data,
            columns,
          },
        })
      }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, payload }) => {
        if (pathname === '/monitoroverview') {
          const { pollutantType = null, searchTime = null, monitortype = 'realtime' } = payload || {}
          dispatch({ type: 'querydata',
            payload: {
              pollutantType,
              searchTime,
              monitortype,
            },
          })
        }
      })
    },
  },
})

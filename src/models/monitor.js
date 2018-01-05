import { loadPollutantType, loadPollutant, loadMonitoroverView } from '../services/api';
import { Model } from '../dvapack';
import moment from 'moment';
import { Icon } from 'antd';

export default Model.extend({
  namespace: 'monitor',
  state: {
    columns: [],
    data: [],
  },
  effects: {
    * querydata({
      payload,
    }, { call, update }) {
      const pollutanttyperesult = yield call(loadPollutantType);
      const pollutanttype = pollutanttyperesult.data;
      if (payload.pollutantType == null) {
        payload.pollutantType = pollutanttype[0].ID;
      }
      const columnpollutant = yield call(loadPollutant, payload);
      const columns = [
        {
          title: '状态',
          width: 70,
          dataIndex: 'status',
          key: 'status',
          fixed: 'left',
          render: text => <Icon type="laptop" style={{ fontSize: 16, color: text === 0 ? '#b0b0b1' : text === 1 ? '#66a404' : text === 2 ? '#ff0000' : '#b9c305' }} />,
        },
        {
          title: '监测点',
          width: 300,
          dataIndex: 'point',
          key: 'point',
          fixed: 'left',
        },
        {
          title: '监测时间',
          width: 200,
          dataIndex: 'datetime',
          key: 'datetime',
          fixed: 'left',
        },
      ];
      columnpollutant.data.map((item, key) => {
        if (key === columnpollutant.data.length - 1) {
          columns.push({
            title: `${item.PollutantName}[${item.Unit}]`,
            dataIndex: item.PollutantCode,
            sorter: (a, b) => {
              if (a[item.PollutantCode] === '-') {
                return -1;
              }
              if (b[item.PollutantCode] === '-') {
                return 1;
              }
              if (a[item.PollutantCode] > b[item.PollutantCode]) {
                return 1;
              }
              if (a[item.PollutantCode] < b[item.PollutantCode]) {
                return -1;
              }
              return 0;
            },
            key: item.PollutantCode,
            render: text => <span style={{ color: text ? text.split('|')[1] : '#666666' }}>{text ? text.split('|')[0] : '-'}</span >,
          });
        } else {
          columns.push({
            title: `${item.PollutantName}[${item.Unit}]`,
            width: 180,
            dataIndex: item.PollutantCode,
            sorter: (a, b) => {
              if (a[item.PollutantCode] === '-') {
                return -1;
              }
              if (b[item.PollutantCode] === '-') {
                return 1;
              }
              if (a[item.PollutantCode] > b[item.PollutantCode]) {
                return 1;
              }
              if (a[item.PollutantCode] < b[item.PollutantCode]) {
                return -1;
              }
              return 0;
            },
            key: item.PollutantCode,
            render: text => <span style={{ color: text ? text.split('|')[1] : '#666666' }}>{text ? text.split('|')[0] : '-'}</span >,
          });
        }
      });
      const result = yield call(loadMonitoroverView, payload);
      const data = [];

      result.data.map((item, key) => {
        const dataitem = {
          status: item.status,
          point: `${item.pname}-${item.text}`,
          datetime: item.Times,
        };
        columns.map((columnsitem, columnskey) => {
          if (columnskey > 2) {
            dataitem[columnsitem.key] = item[columnsitem.key]
              ? `${item[columnsitem.key]}|${item[`${columnsitem.key}_color`]}`
              : '-';
          }
        });
        dataitem.key = key + 1;
        data.push(dataitem);
      });

      if (result) {
        yield update({ data, columns });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, payload }) => {
        if (pathname === '/list') {
          const { pollutantType = null, searchTime = moment().format('YYYY-MM-DD'), monitortype = 'realtime' } = payload || {};
          dispatch({ type: 'querydata',
            payload: {
              pollutantType,
              searchTime,
              monitortype,
            },
          });
        }
      });
    },
  },
});

import moment from 'moment';
import { Icon } from 'antd';
import { loadPollutantType, loadPollutant, loadMonitoroverView,loadCountryPointView } from '../services/api';
import { Model } from '../dvapack';
import { Link } from 'dva/router';

export default Model.extend({
  namespace: 'monitor',
  state: {
    columns: [],
    data: [],
    CouontryInfo:[]
  } ,
  effects: {
    * querydata({
      payload,
    }, { call, update }) {
      const pollutanttyperesult = yield call(loadPollutantType);
      const pollutanttype = pollutanttyperesult.data;
      if (payload.pollutantType == null) {
        payload.pollutantType = pollutanttype[0].PollutantTypeCode ;
      }
      if(!payload.monitortype)
      {
        payload.monitortype = "realtime";
      }
     
      if(!payload.keyWords)
      {
        payload.keyWords ="";
      }
 
      if(payload.regionCode!=null && payload.regionCode!="")
      {
        payload.regionCode+="000";
      }
      const columnpollutant = yield call(loadPollutant, payload);
      const _this=this;
      const columns = [
        {
          title: '状态',
          width: 70,
          dataIndex: 'status',
          key: 'status',
          fixed: columnpollutant.data.length > 5 ? 'left' : false,
          render: text => <Icon type="laptop" style={{ fontSize: 16, color: text === 0 ? '#b0b0b1' : text === 1 ? '#66a404' : text === 2 ? '#ff0000' : '#b9c305' }} />,
        },
        {
          title: '监测点',
          width: 300,
          dataIndex: 'point',
          key: 'point',
          fixed: columnpollutant.data.length > 5 ? 'left' : false,
          render: (text,record) => <span style={{fontWeight:record.pointType==='country'?'bold':''}}>{text}</span >,
        },
        {
          title: '监测时间',
          width: 200,
          dataIndex: 'datetime',
          key: 'datetime',
          fixed: columnpollutant.data.length > 5 ? 'left' : false,
          render: (text,record) => <span style={{fontWeight:record.pointType==='country'?'bold':''}}>{text}</span >,
        },
      ];

      columnpollutant.data.map((item, key) => {
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
          render: (text,record) => <span style={{ color: text ? text.split('|')[1] : '#666666',fontWeight:record.pointType==='country'?'bold':''}}>{text ? text.split('|')[0] : '-'}</span >,
        });
      });
 
      const result = yield call(loadMonitoroverView, payload);
      const data = [];
      const GroupID=[];

      if(result.data!=null || result.length>0)
      {
       console.log(result.data)
        result.data.map((item, key) => {
          const dataitem = {
            DGIMN: item.DGIMN,
            status: item.status,
            point: `${item.parentName}-${item.pointName}`,
            datetime: item.MonitorTime,
            pointType:"monitorData"
          };
          columns.map((columnsitem, columnskey) => {
            if (columnskey > 2) {
              dataitem[columnsitem.key] = item.value[columnsitem.key]
                ? `${item.value[columnsitem.key]}|${item.value[`${columnsitem.key}_params`]?item.value[`${columnsitem.key}_params`].split('§')[3]:""}`
                : '-';
            }
          });
          dataitem.key = key + 1;
          console.log(dataitem);
          data.push(dataitem);
          if(GroupID.indexOf(item.groupID)==-1&&item.groupID!=null){
            GroupID.push(item.groupID);
          }
          payload.GroupID=GroupID;
          
        });
     
        //国控数据加载
        const results = yield call(loadCountryPointView, payload);
        const countryPayload= {
           ...payload,
           monitortype:'minute'
        }
        const countryresults = yield call(loadCountryPointView, countryPayload);
        yield update({ CouontryInfo: countryresults });
        if(results!=null){
       
          results.data.map((item,key)=>{
            const dataitem = {
              DGIMN: item.DGIMN,
              status: item.status,
              point: item.text,
              datetime: item.Times,
              pointType:"country"
            };
            columns.map((columnsitem,columnskey)=>{
              if(columnskey>2){
                dataitem[columnsitem.key] = item[columnsitem.key]
                  ? `${item[columnsitem.key]}|${item[`${columnsitem.key}_color`]}`
                  : '-';
              }
            });
            dataitem.key = data.length + 1;
            data.push(dataitem);
          });
        }
        if (result) {
          yield update({ data, columns });
        }
      }
      else
      {
        const data=null;
        yield update({ data, columns });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, payload }) => {
        if (pathname === '/monitor/list/mlist') {
          const { pollutantType = null,regionCode='',keyWords='',searchTime = moment().format('YYYY-MM-DD'), monitortype = 'realtime',GroupID=[] } = payload || {};
          dispatch({ type: 'querydata',
            payload: {
              pollutantType,
              monitortype,
              GroupID,
              regionCode,
              keyWords,
            },
          });
        }
      });
    },
  },
});

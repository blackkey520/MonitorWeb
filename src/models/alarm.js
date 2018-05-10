
import { Model } from '../dvapack';
import { getTimeDistance } from '../utils/utils';
import { getAlarmHistoryList } from '../services/api';
import * as service from '../dvapack/websocket/mywebsocket';
import { debug } from 'util';
 
export default Model.extend({
    namespace: 'alarm',
    state: {
      data: [],
      total: 0,
      size: 10,
      current: 1,
      querydate: [],
      Tablewidth:280,
      columns : [  
    //  {
    //     title: '企业/站点',
    //     dataIndex: 'ParentName',
    //     key: 'ParentName',
    //     width:280,
    //     fixed: 'left',
    //     align:'center'
    //   },  {
    //     title: '排口/设备',
    //     dataIndex: 'PointName',
    //     key: 'PointName',
    //     width:280,
    //     fixed: 'left',
    //     align:'center'
    //   },  
      {
        title: '报警类型',
        dataIndex: 'AlarmType',
        key: 'AlarmType',
        width:280,
        align:'center',
        render: (text, record) =>{
            let showtext="超标";
            if(text==="0")
                showtext="异常";
            return (
            <span>{showtext}</span>
          )},
      },  {
        title: '数据类型',
        dataIndex: 'DataDtype',
        key: 'DataDtype',
        width:280,
        align:'center',
        render: (text, record) =>{
            let showtext="小时数据";
            if (text === "RealTime")
                showtext = "实时数据";
            else if (text === "Minute")
                showtext = "分钟数据";
            else if (text === "day")
                showtext = "日数据";
            return (
            <span>{showtext}</span>
          )},
      },  {
        title: '报警信息',
        dataIndex: 'AlarmMsg',
        key: 'AlarmMsg',
        width:500,
        align:'center'
      }, {
        title: '报警时间',
        dataIndex: 'AlarmTime',
        key: 'AlarmTime',
        width:280,
        align:'center'
      },  {
        title: '首次报警时间',
        dataIndex: 'FirstTime',
        key: 'FirstTime',
        width:280,
        align:'center'
      }, {
        title: '污染物/设备',
        dataIndex: 'PollutantName',
        key: 'PollutantName',
        width:150,
        align:'center'
      }, {
        title: '报警次数',
        dataIndex: 'AlarmCount',
        key: 'AlarmCount',
        width:150,
        align:'center'
      }, {
        title: '核实状态',
        dataIndex: 'State',
        key: 'State',
        width:150,
        align:'center',
        render: (text, record) =>{
            let showtext="未核实";
            if (text === "2")
                showtext = "已核实";                
            return (
            <span>{showtext}</span>
          )},
      }],
      verifyState: ""
    },
    effects: {
      *getAlarmHistoryList({ payload }, { call, put, select }) {
        const { data } = yield select(t => t.alarm);
        const res = yield call(getAlarmHistoryList, payload);
        let newdata = data;
        if (res.data && res.data != "暂无数据") {            
            //首次调用不追加
            if(payload.current==1)
                newdata=res.data;
            else
                newdata =newdata.concat(res.data);
        }else{
            newdata=[];
        }
        debugger;
        yield put({
            type:"changeAlarmHistory",
            payload:{
                data:newdata,
                current:payload.current,
                querydate:payload.querydate,
                verifyState:payload.verifyState,
                total:res.total
            }
        });
      },
    },
  
    reducers: {
        changeAlarmHistory(state, { payload }) {
        return {
          ...state,
          data: payload.data,
          current: payload.current,
          querydate: payload.querydate,
          verifyState:payload.verifyState,
          total: payload.total,
        };
      },
    },
  });
  
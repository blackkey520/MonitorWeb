import moment from 'moment';
import { loadMonitorPoint, loadLastdata, loadMonitorDatalist,maploadMonitorDatalist, loadPointDetail ,loadCountryMonitorDatalist} from '../services/api';
import { Model } from '../dvapack';
import { debug } from 'util';


export default Model.extend({
  namespace: 'points',
  state: {
    pointlist: [],
    lastdata: [],
    pollutant: {},
    hourtendency: [],
    selectpoint: [],
    isfinished:false,
    selpoint: null,
    columns : [ {
      title: '监控时间',
      dataIndex: 'MonitorTime',
      key: 'MonitorTime',
      width:280,
      fixed: 'left',
      align:'center'
    }, {
      title: '浓度',
      dataIndex: 'MonitorValue',
      key: 'MonitorValue',
      width:100,
      render: (text, record) => (
        <div style={{ color: record.color} }>{text}</div>
      ),
    }],
    data: [],
    total: 0,
    size: 30,
    current: 1,
    querydate: [],
    monitortype:  'realtime',
    selpollutant: null,
    dateformat: 'YYYY-MM-DD HH:mm:ss',
    chartdata:[],
    Tablewidth:280,
    countryArray:[],
    countryid:[],
    pointName:""
  },
  effects: {
    * querypointdetail({
      payload,
    }, { call, update, put ,select}) {
      let { pointName } = yield select(_ => _.points);
      let { countryid } = yield select(_ => _.points);
      let { countryArray } = yield select(_ => _.points);
      let { columns } = yield select(_ => _.points);
      let { Tablewidth } = yield select(_ => _.points);
      Tablewidth=280;
      columns= [{
        title: '监控时间',
        dataIndex: 'MonitorTime',
        key: 'MonitorTime',
        width:180,
        fixed: 'left',
        align:'center'
      }, {
        title: '浓度',
        dataIndex: 'MonitorValue',
        key: 'MonitorValue',
        width:100,
       
        render: (text, record) => (
          <div style={{ color: record.color} }>{text}</div>
        ),
      }];
      countryid=[];
      countryArray=[];
     
      if(pointName=="monitorData")
        pointName=payload.point.split('-')[1];
      else
        pointName=payload.point;
      yield update({ Tablewidth });
      yield update({ columns });
      yield update({ pointName });
      yield update({ countryid });
      yield update({ countryArray });
      const { data } = yield call(loadPointDetail, { dgimn: payload.DGIMN, fileLength: 50000, width: 300 });
      yield update({ selpoint: data });
        yield put({
          type: 'querypointdata',
          payload: { dgimn: payload.DGIMN, 
            pollutant: data.PollutantTypeInfo[0].PolluntCode, 
            querydate:  payload.pointType=="monitorData"?[moment().add(-30, 'm'), moment()]:[moment().add(-24, 'h'), moment()],
            monitortype: payload.pointType=="monitorData"?"realtime":"hour",
            pointType:payload.pointType,
            current: 1, 
            dateformat: 'YYYY-MM-DD HH:mm:ss' },
        });
    },
    //国控对比数据
    * querychartpointdata({
         payload,
     }, { call, update, put, select }) {
      
         yield update({isfinished:true});
         const { size } = yield select(_ => _.points);
         let { chartdata } = yield select(_ => _.points);
         let { data } = yield select(_ => _.points);
         let { columns } = yield select(_ => _.points);
         let { Tablewidth } = yield select(_ => _.points);
         let { countryArray } = yield select(_ => _.points);
         let { countryid } = yield select(_ => _.points);
         let mnlist=[];
         if(payload.isclear)
         {
           countryid=[];
           countryArray=[];
           columns= [{
            title: '监控时间',
            dataIndex: 'MonitorTime',
            key: 'MonitorTime',
            width:180,
            fixed: 'left',
            align:'center'
          }, {
            title: '浓度',
            dataIndex: 'MonitorValue',
            key: 'MonitorValue',
            width:100,
           
            render: (text, record) => (
              <div style={{ color: record.color} }>{text}</div>
            ),
          }];
       
          let allcountrydata=[];
          payload.countrydgimn.map((item,key)=>{
            countryArray.push(item);
            countryid.push(item.key)
            columns.push({
              title: item.label,
              dataIndex: item.key,
              key: item.key,
             })
             mnlist.push(item.key);
          });
         
          const result = yield call(maploadMonitorDatalist, { 
            PollutantCode: payload.pollutant,
            BeginTime: payload.querydate[0].format(payload.dateformat),
            EndTime: payload.querydate[1].format(payload.dateformat),
            pageIndex: payload.current,
            pageSize: size,
            dataType: payload.monitortype,
            pointType:payload.pointType,
            mnlist:mnlist
          });
         
          if(result!=null)
          {
            allcountrydata= allcountrydata.concat(result);
          }
          allcountrydata.map((item,key)=>{
              const existdata = chartdata.find((value, index, arr) => {
                return value.MonitorTime==item.MonitorTime && value.DGIMN==item.DGIMN;
              })
              if(!existdata)
              {
                chartdata.push(item);
              }
          
          })
          yield update({ columns });
          yield update({ Tablewidth });
          yield update({ countryid });

         }
         else
         {
          
          let dgimn='';
          let existdata ='';
          let exist='';
          if(payload.countrydgimn.length<countryArray.length)
          {
            countryid=[];
            countryArray=[];
            columns= [{
             title: '监控时间',
             dataIndex: 'MonitorTime',
             key: 'MonitorTime',
             width:180,
             fixed: 'left',
             align:'center'
           }, {
             title: '浓度',
             dataIndex: 'MonitorValue',
             key: 'MonitorValue',
             width:100,
            
             render: (text, record) => (
               <div style={{ color: record.color} }>{text}</div>
             ),
           }];
           payload.countrydgimn.map((item,key)=>{
            countryArray.push(item);
            countryid.push(item.key)
            columns.push({
              title: item.label,
              dataIndex: item.key,
              key: item.key,
             })
           })
          }
          else{
            payload.countrydgimn.map((item,key)=>{
              existdata=countryid.indexOf(item.key);
              if(existdata=="-1")
              {
                exist=item;
                dgimn=exist.key;
              }
            })
             if(existdata=="-1")
             {
                countryArray.push(exist);
                countryid.push(exist.key)
                columns.push({
                  title: exist.label,
                  dataIndex: exist.key,
                  key: exist.key,
                 })
             }
          
          }
         
          
          Tablewidth=280+countryid.length*100;
          yield update({ countryid ,countryArray,Tablewidth,columns});
          if(!dgimn)
          {
            yield update({ isfinished:false });
            return;
          }
        
          const result = yield call(loadMonitorDatalist, { 
           PollutantCode: payload.pollutant,
           DGIMN: dgimn,
           BeginTime: payload.querydate[0].format(payload.dateformat),
           EndTime: payload.querydate[1].format(payload.dateformat),
           pageIndex: payload.current,
           pageSize: size,
           dataType: payload.monitortype,
           pointType:payload.pointType,
         });
         if(!payload.isclear)
         {
           const resultdata = yield call(loadMonitorDatalist, { 
             PollutantCode: payload.pollutant,
             DGIMN: payload.dgimn,
             BeginTime: payload.querydate[0].format(payload.dateformat),
             EndTime: payload.querydate[1].format(payload.dateformat),
             pageIndex: payload.current,
             pageSize: size,
             dataType: payload.monitortype,
             pointType:payload.pointType,
           });
           const resultda = [];
           if(resultdata.data!=null)
           {
             resultdata.data.map((item, key) => {
               if (payload.monitortype === 'realtime')
               {
                 resultda.push(item);
               } else if (payload.monitortype === 'minute')
               {
                 item.MonitorValue = item.AvgValue;
                 resultda.push(item);
               } else if (payload.monitortype === 'hour' )
               {
                 item.MonitorValue = item.AvgValue;
                 item.MonitorTime = moment(item.MonitorTime).format('YYYY-MM-DD HH');
                 resultda.push(item);
               }
               else if (payload.monitortype === 'day' )
               {
                 item.MonitorValue = item.AvgValue;
                 item.MonitorTime = moment(item.MonitorTime).format('YYYY-MM-DD');
                 resultda.push(item);
               }
             });
             data = resultda;
           }
         }
         if(result.data!=null)
         {
           if (payload.current != 1) {
             chartdata = result.data.concat(chartdata);
           } else {
             chartdata = result.data.concat(chartdata);
           }
         }
         }
     
         data.map((item,key)=>{
          chartdata.map((citem,ckey)=>{
            if(payload.monitortype=="hour")
            {
              if(item.MonitorTime == moment(citem.MonitorTime).format('YYYY-MM-DD HH'))
              {
                item[citem.DGIMN]=citem.AvgValue;
              }
            }
            else{
              if(item.MonitorTime == moment(citem.MonitorTime).format('YYYY-MM-DD'))
              {
                item[citem.DGIMN]=citem.AvgValue;
              }
            }
          })
        })
        yield update({ data,chartdata,isfinished:false });
     },
    * querypointdata({
      payload,
    }, { call, update, put, select }) {

      const { size } = yield select(_ => _.points);
      const pointType=payload.pointType;
      const PollutantCode=payload.pollutant;
      const result = yield call(loadMonitorDatalist, { 
        PollutantCode: payload.pollutant,
        DGIMN: payload.dgimn,
        BeginTime: payload.querydate[0].format(payload.dateformat),
        EndTime: payload.querydate[1].format(payload.dateformat),
        pageIndex: payload.current,
        pageSize: size,
        dataType: payload.monitortype,
        pointType:payload.pointType,
      });
      let resultdata = [];
      const resultda = [];
      if (result.data !== null)
      {
        result.data.map((item, key) => {
          if (payload.monitortype === 'realtime')
          {
            resultda.push(item);
          } else if (payload.monitortype === 'minute')
          {
            item.MonitorValue = item.AvgValue;
            resultda.push(item);
          } else if (payload.monitortype === 'hour' )
          {
            item.MonitorValue = item.AvgValue;
            item.MonitorTime = moment(item.MonitorTime).format('YYYY-MM-DD HH');
            resultda.push(item);
          }
          else if (payload.monitortype === 'day' )
          {
            item.MonitorValue = item.AvgValue;
            item.MonitorTime = moment(item.MonitorTime).format('YYYY-MM-DD');
            resultda.push(item);
          }
        });
      }
      if (payload.current != 1) {
        const { data } = yield select(_ => _.points);
        resultdata = data.concat(resultda);
      } else {
        resultdata = resultda;
      }
      yield update({ data: resultdata, total: result.total, current: payload.current, querydate: payload.querydate, monitortype: payload.monitortype, selpollutant: payload.pollutant, dateformat: payload.dateformat });
      if(payload.countrydgimn)
      {
        yield put({
          type: 'querychartpointdata',
          payload: { ...payload, isclear:true},
        });
      }

    },
    * querypointlastdata({
      payload,
    }, { call, update, put }) {
      const { data: { RealtimeData: lastdata } } = yield call(loadLastdata, { dgimn: payload.itemdata.dgimn });
      yield update({
        selectpoint: payload.itemdata,
        lastdata,
      });
      if (lastdata[0]) {
        yield put({ type: 'queryhourtendency', payload: { pollutant: { PollutantCode: lastdata[0].PollutantCode, PollutantName: lastdata[0].PollutantName, Unit: lastdata[0].Unit } } });
      }
    },
    * queryhourtendency({
      payload,
    }, { call, select, update }) {
      const { selectpoint } = yield select(_ => _.points);
      const result = yield call(loadMonitorDatalist, { PollutantCode: payload.pollutant.PollutantCode,
        DGIMN: selectpoint.dgimn,
        BeginTime: moment().add(-12, 'hours').format('YYYY-MM-DD HH:00:00'),
        EndTime: moment().add(1, 'hours').format('YYYY-MM-DD HH:00:00'),
        pageIndex: 1,
        pageSize: 1000,
        dataType: 'hour',
      });
      const hourtendency = [];
      if (result.data) {
        result.data.map((item, key) => {
          hourtendency.push({
            x: moment(item.MonitorTime).format('YYYY-MM-DD HH:00:00'),
            y: item.AvgValue,
          });
        });
      }
      yield update({
        hourtendency,
        pollutant: payload.pollutant,
      });
    },
    * querymonitorpoint({
      payload,
    }, { call, select, update }) {
      const { pollutanttype } = yield select(_ => _.global);
      if (payload.pollutantType == null) {
        payload.pollutantType = pollutanttype[0].ID;
      }
      const result = yield call(loadMonitorPoint, payload);
      const pointlist = result.data;
      yield update({ pointlist });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, payload }) => {
        if (pathname === '/monitor/map') {
          const {
            pollutantType = null,
            pageIndex = 1,
            pageSize = 10000,
          } = payload || {};
          if (!payload) {
            dispatch({
              type: 'querymonitorpoint',
              payload: {
                pollutantType,
                pageIndex,
                pageSize,
              },
            });
          }
        }
      });
    },
  },
});

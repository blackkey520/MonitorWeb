// import liraries
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message ,Tabs, DatePicker, Select, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import RealTimeData from './RealTimeData';
import MinuteData from './MinuteData';
import HourData from './HourData';
import DayData from './DayData';
import AlarmData from './AlarmData';
import {delay} from '../../utils/utils'
import { debug } from 'util';
 



const { TabPane } = Tabs;
const Option = Select.Option;

const RangePicker = DatePicker.RangePicker;
@connect(({ loading, points ,monitor,countrypoints,alarm}) => ({
  ...loading,
  selpoint: points.selpoint,
  isfinished:points.isfinished,
  current: points.current,
  countryPointInfo:monitor.CouontryInfo,
  size:alarm.size
}))
class MonitorDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.state = { 
      monitortype: 'realtime',
      dateformat: 'YYYY-MM-DD HH:mm:ss',
      querydate: [moment().add(-30, 'm'), moment()],
      pollutant:  props.selpoint.pollutantList[0].pollutantCode,
      countryPointInfo:[],
      countrydgimn:'',
      PointName: props.selpoint.pointName,
      countrylength: 0,
      alarmquerydate: [moment(moment().format('YYYY-MM-DD 00:00:00')), moment()],
      verfystate: ""
    };
     
  }
  onChange=(key) => {
    const newstate = {};
    let isalarm=false;
    if (key === 'realtime')
    {
      newstate.PointName=this.state.PointName;
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-30, 'm'), moment()];
      newstate.dateformat = 'YYYY-MM-DD HH:mm:ss';
      isalarm=true;
    } else if (key === 'minute') {
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-12, 'h'), moment()];
      newstate.dateformat = 'YYYY-MM-DD HH:mm:00';
      isalarm=true;
    } else if (key === 'hour')
    {
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-24, 'h'), moment()];
      newstate.dateformat = 'YYYY-MM-DD HH:00:00';
      isalarm=true;
    } else if (key === 'day')
    {
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-1, 'M'), moment()];
      newstate.dateformat = 'YYYY-MM-DD 00:00:00';
      isalarm=true;
    }
    else if(key==="alarm"){      
      this.setState({
        monitortype: key,
      });
      this.props.dispatch({
        type: 'alarm/getAlarmHistoryList',
        payload: {
          querydate: [moment().format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD HH:mm:ss')],
          dgimn: this.props.selpoint.DGIMN,
          pageindex: 1,
          current: 1,
          beginTime: moment().format('YYYY-MM-DD 00:00:00'),
          endTime:moment().format('YYYY-MM-DD HH:mm:ss'),
          pagesize:this.props.size
        },
      });
    }

    if (isalarm) {
      this.setState({
        ...newstate,
      });
      this.props.dispatch({
        type: 'points/querypointdata',
        payload: {
          dgimn: this.props.selpoint.DGIMN,
          current: 1,
          ...newstate,
          pollutant: this.state.pollutant,
        },
      });
    }
  }
  onDateChange=(dates, dateStrings) => {
    if (this.state.monitortype != "alarm") {
      this.setState({
        querydate: dates,
      });
    } else {
      this.setState({
        alarmquerydate: dates,
      });
    }
  }
  onDateOK = () => {
      if (this.state.monitortype != "alarm") {
        this.props.dispatch({
          type: 'points/querypointdata',
          payload: {
            dgimn: this.props.selpoint.DGIMN,
            current: 1,
            ...this.state,
          },
        });
      } else {
        this.props.dispatch({
          type: 'alarm/getAlarmHistoryList',
          payload: {
            querydate: this.state.alarmquerydate,
            dgimn: this.props.selpoint.DGIMN,
            pageindex: 1,
            current: 1,
            beginTime: this.state.alarmquerydate[0].format('YYYY-MM-DD 00:00:00'),
            endTime: this.state.alarmquerydate[1].format('YYYY-MM-DD HH:mm:ss'),
            pagesize: this.props.size,
            verifyState: this.state.verfystate
          },
        });
      }
  }
  onPollutantChange=(value) => {
    this.setState({
      pollutant: value,
    });
 
    this.props.dispatch({
      type: 'points/querypointdata',
      payload: {
        dgimn: this.props.selpoint.DGIMN,
        current: 1,
        ...this.state,
        pollutant: value,
      },
    });
  }
  onCountryChange=(value)=>{ 
    if(!this.props.isfinished)
    {
      if(value.length>5)
      {
        return  message.info('最多只能选择5个点对比');
      }
      this.setState({
        countryPointInfo: value,
        countrydgimn:value
      });
      this.props.dispatch({
        type: 'points/querychartpointdata',
        payload: {
          ...this.state,
          dgimn: this.props.selpoint.DGIMN,
          current: 1,
          countrydgimn:value,
        },
      });
    }
    else{
      return  message.info('您操作的太快了');
    }
    this.setState({
      countrylength:value.length
    })
  }  
  handleChange =(value)=> {
    this.setState({
      verfystate: value
    });

    this.props.dispatch({
      type: 'alarm/getAlarmHistoryList',
      payload: {
        querydate: this.state.alarmquerydate,
        dgimn: this.props.selpoint.DGIMN,
        pageindex: 1,
        current: 1,
        beginTime: this.state.alarmquerydate[0].format('YYYY-MM-DD 00:00:00'),
        endTime:this.state.alarmquerydate[1].format('YYYY-MM-DD HH:mm:ss'),
        pagesize:this.props.size,
        verifyState:value
      },
    });
  }
  render() {
    const { selpoint, effects ,countryPointInfo} = this.props;
    return (
      <div
        style={{ width: '100%',
        height: 'calc(100vh - 120px)' }}
        >
        <Tabs
          onChange={this.onChange}
          tabBarExtraContent={
            <div>
               {
                 this.state.monitortype=="hour" || this.state.monitortype=="day"?
                  <Select mode="multiple"   
                  value={this.state.countryPointInfo} style={{ width: 500 }} onChange={this.onCountryChange} labelInValue={true}   placeholder="请选择对比国控点">
                  {
                      countryPointInfo.map((item, key) => {
                        return <Option key={key} value={item.DGIMN}>{item.pointName}</Option>;
                      })
                    }
                  </ Select>: 
                  <div></div>
               }
              {
                this.state.monitortype != "alarm" ?
                  <Select value={this.state.pollutant} style={{ width: 120 }} onChange={this.onPollutantChange} style={{ marginLeft: 10 }}>
                    {
                      selpoint.pollutantList.map((item, key) => {
                        return <Option key={key} value={item.pollutantCode}>{item.pollutantName}</Option>;
                      })
                    }
                  </Select> : <Select defaultValue={this.state.verfystate} value={this.state.verfystate} style={{ width: 120 }} onChange={this.handleChange}>
                    <Option value="">全部</Option>
                    <Option value="0">未核实</Option>
                    <Option value="2">已核实</Option>
                  </Select>
              }
              <RangePicker
                value={this.state.monitortype != "alarm" ? this.state.querydate : this.state.alarmquerydate}
                ranges={{ 今天: [moment(), moment()], 本月: [moment(), moment().endOf('month')], 上个月: [moment(), moment().endOf('month')] }}
                showTime
                format={this.state.dateformat}
                onChange={this.onDateChange}
                onOk={this.onDateOK}
                style={{ marginLeft: 10 }}
              />
            </div>}
          >
          <TabPane tab="实时数据" key="realtime"  >
            <RealTimeData  dataType={'realTime'}/>
          </TabPane>
          <TabPane tab="分钟数据" key="minute"  >
            <MinuteData  dataType={'minute'}/>
          </TabPane>
          <TabPane tab="小时数据" key="hour" >
            <HourData dataType={'hour'}/>
          </TabPane>
          <TabPane tab="日数据" key="day" >
            <DayData dataType={'day'}/>
          </TabPane>
          <TabPane tab="报警数据" key="alarm" >
           <AlarmData/>
          </TabPane>
        </Tabs>
        {/* {this.props.match.params.pointid} */}
      </div>
    );
  }
}
// make this component available to the app
export default MonitorDetail;

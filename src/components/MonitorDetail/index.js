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
import {delay} from '../../utils/utils'
import { debug } from 'util';
 



const { TabPane } = Tabs;
const Option = Select.Option;

const RangePicker = DatePicker.RangePicker;
@connect(({ loading, points ,monitor,countrypoints}) => ({
  ...loading,
  selpoint: points.selpoint,
  isfinished:points.isfinished,
  current: points.current,
  countryPointInfo:monitor.CouontryInfo.data
}))
class MonitorDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    debugger;
    console.log(props.selpoint.pollutantList[0].pollutantCode)
    this.state = { 
      monitortype: 'realtime',
      dateformat: 'YYYY-MM-DD HH:mm:ss',
      querydate: [moment().add(-30, 'm'), moment()],
      pollutant:  props.selpoint.pollutantList[0].pollutantCode,
      countryPointInfo:[],
      countrydgimn:'',
      PointName: props.selpoint.pointName,
      countrylength:0
    };
     
  }
  onChange=(key) => {
    const newstate = {};
    
    if (key === 'realtime')
    {
      newstate.PointName=this.state.PointName;
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-30, 'm'), moment()];
      newstate.dateformat = 'YYYY-MM-DD HH:mm:ss';
    } else if (key === 'minute') {
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-12, 'h'), moment()];
      newstate.dateformat = 'YYYY-MM-DD HH:mm:00';
    } else if (key === 'hour')
    {
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-24, 'h'), moment()];
      newstate.dateformat = 'YYYY-MM-DD HH:00:00';
    } else if (key === 'day')
    {
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-1, 'M'), moment()];
      newstate.dateformat = 'YYYY-MM-DD 00:00:00';
    }
    this.setState({
      ...newstate,
    });

   
    this.props.dispatch({
      type: 'points/querypointdata',
      payload: {
        dgimn: this.props.selpoint.Point.Dgimn,
        current: 1,
        ...newstate,
        pollutant: this.state.pollutant,
      },
    });
  }
  onDateChange=(dates, dateStrings) => {
    this.setState({
      querydate: dates,
    });
  }
  onDateOK=() => {
    this.props.dispatch({
      type: 'points/querypointdata',
      payload: {
        dgimn: this.props.selpoint.DGIMN,
        current: 1,
        ...this.state,
      },
    });
   
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
          dgimn: this.props.selpoint.Point.Dgimn,
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
                 this.state.monitortype!="realtime" && this.state.monitortype!="minute"?
                  <Select mode="multiple"   
                  value={this.state.countryPointInfo} style={{ width: 500 }} onChange={this.onCountryChange} labelInValue={true}   placeholder="请选择对比国控点">
                  {
                      countryPointInfo.map((item, key) => {
                        return <Option key={key} value={item.DGIMN}>{item.text}</Option>;
                      })
                    }
                  </ Select>: 
                  <div></div>
               }
              <Select value={this.state.pollutant} style={{ width: 120 }} onChange={this.onPollutantChange} style={{ marginLeft: 10 }}>
                {
                  selpoint.pollutantList.map((item, key) => {
                    return <Option key={key} value={item.pollutantCode}>{item.pollutantName}</Option>;
                  })
                }
              </Select>
              <RangePicker
                value={this.state.querydate}
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
        </Tabs>
        {/* {this.props.match.params.pointid} */}
      </div>
    );
  }
}
// make this component available to the app
export default MonitorDetail;

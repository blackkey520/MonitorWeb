// import liraries
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tabs, DatePicker, Select, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import CountryHourData from './CountryHourData';
import CountryDayData from './CountryDayData';

const { TabPane } = Tabs;
const Option = Select.Option;

const RangePicker = DatePicker.RangePicker;

@connect(({ loading, points }) => ({
  ...loading,
  selpoint: points.selpoint,
  current: points.current,
}))

class CountryDetail extends PureComponent {
  
  constructor(props) {
     
    super(props);
    this.menus = props.menuData;
    this.state = {
      monitortype: 'hour',
      dateformat: 'YYYY-MM-DD HH:00:00',
      querydate: [moment().add(-24, 'h'), moment()],
      pollutant: props.selpoint.PollutantTypeInfo[0].PolluntCode,
      pointType:props.pointType
    };
  }
  onChange=(key) => {
    const newstate = {};
    if (key === 'hour')
    {
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-24, 'h'), moment()];
      newstate.dateformat = 'YYYY-MM-DD HH:00:00';
      newstate.pointType=this.props.pointType;
    } else if (key === 'day')
    {
      newstate.monitortype = key;
      newstate.querydate = [moment().add(-1, 'M'), moment()];
      newstate.dateformat = 'YYYY-MM-DD 00:00:00';
      newstate.pointType=this.props.pointType;
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
        dgimn: this.props.selpoint.Point.Dgimn,
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
        dgimn: this.props.selpoint.Point.Dgimn,
        current: 1,
        ...this.state,
        pollutant: value,
      },
    });
  }
  render() {
    const { selpoint, effects } = this.props;
    return (
      <div
        style={{ width: '100%',
        height: 'calc(100vh - 120px)' }}
        >
        <Tabs
          onChange={this.onChange}
          tabBarExtraContent={
            <div>
              <Select value={this.state.pollutant} style={{ width: 120 }} onChange={this.onPollutantChange}>
                {
                  selpoint.PollutantTypeInfo.map((item, key) => {
                    return <Option key={key} value={item.PolluntCode}>{item.PolluntName}</Option>;
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
          
          <TabPane tab="小时数据" key="hour" >
            <CountryHourData dataType={'hour'} pointType={'country'}/>
          </TabPane>
          <TabPane tab="日数据" key="day" >
            <CountryDayData dataType={'day'} pointType={'country'}/>
          </TabPane>
        </Tabs>
        {/* {this.props.match.params.pointid} */}
      </div>
    );
  }
}
// make this component available to the app
export default CountryDetail;

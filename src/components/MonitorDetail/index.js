// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tabs, DatePicker, Select } from 'antd';
import { routerRedux } from 'dva/router';
import RealTimeData from './RealTimeData';
import MinuteData from './MinuteData';
import HourData from './HourData';
import DayData from './DayData';

const { TabPane } = Tabs;
const Option = Select.Option;

const RangePicker = DatePicker.RangePicker;

@connect(({ loading }) => ({
  ...loading,
}))
class MonitorDetail extends Component {
  onChange=(key) => {
    // const { dispatch, match } = this.props;
    // dispatch(routerRedux.push(`${match.url}/${key}`));
  }
onDateChange=(dates, dateStrings) => {

}
onPollutantCVhange=(value) => {

}
render() {
  return (
    <div
      style={{ width: '100%',
      height: 'calc(100vh - 120px)' }}
      >

      <Tabs
        onChange={this.onChange}
        tabBarExtraContent={<div><Select defaultValue="lucy" style={{ width: 120 }} onChange={this.onPollutantCVhange}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="disabled" disabled>Disabled</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
        
          <RangePicker
            ranges={{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }}
            showTime
            format="YYYY/MM/DD HH:mm:ss"
            onChange={this.onDateChange}
            style={{ marginLeft: 10 }}
    />
        </div>}
        >
        <TabPane tab="实时数据" key="realtime" >
          <RealTimeData />
        </TabPane>
        <TabPane tab="分钟数据" key="minute" >
          <MinuteData />
        </TabPane>
        <TabPane tab="小时数据" key="hour" >
          <HourData />
        </TabPane>
        <TabPane tab="日数据" key="day" >
          <DayData />
        </TabPane>
      </Tabs>
      {/* {this.props.match.params.pointid} */}
    </div>
  );
}
}
// make this component available to the app
export default MonitorDetail;

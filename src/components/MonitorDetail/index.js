// import liraries
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tabs, DatePicker, Select,Spin } from 'antd';
import { routerRedux } from 'dva/router';
import RealTimeData from './RealTimeData';
import MinuteData from './MinuteData';
import HourData from './HourData';
import DayData from './DayData';

const { TabPane } = Tabs;
const Option = Select.Option;

const RangePicker = DatePicker.RangePicker;

@connect(({ loading, points }) => ({
  ...loading,
  selpoint: points.selpoint,
}))
class MonitorDetail extends PureComponent {
  onChange=(key) => {
    // const { dispatch, match } = this.props;
    // dispatch(routerRedux.push(`${match.url}/${key}`));
  }
onDateChange=(dates, dateStrings) => {

}
onPollutantCVhange=(value) => {

}
render() {
  const { selpoint,effects } = this.props;
  if(effects['points/querypointdetail'])
  {
    return (<Spin size="large"  />);
  }else{
    return (
    <div
      style={{ width: '100%',
      height: 'calc(100vh - 120px)' }}
      >
      <Tabs
        onChange={this.onChange}
        tabBarExtraContent={
          <div>
            <Select defaultValue={selpoint.PollutantTypeInfo[0].PolluntName} style={{ width: 120 }} onChange={this.onPollutantCVhange}>
              {
                selpoint.PollutantTypeInfo.map((item, key) => {
                  return <Option key={key} value={item.PolluntCode}>{item.PolluntName}</Option>;
                })
              }
            </Select>
            <RangePicker
              defaultValue={[moment('2015-06-06', 'YYYY-MM-DD'), moment('2015-06-06', 'YYYY-MM-DD')]}
              ranges={{ '今天': [moment(), moment()], '本月': [moment(), moment().endOf('month')],'上个月': [moment(), moment().endOf('month')] }}
              showTime
              format="YYYY/MM/DD HH:mm:ss"
              onChange={this.onDateChange}
              style={{ marginLeft: 10 }} />
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
}
// make this component available to the app
export default MonitorDetail;

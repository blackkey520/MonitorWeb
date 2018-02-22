// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';


@connect(({ loading, monitor, global }) => ({
  ...loading,
  columns: monitor.columns,
  data: monitor.data,
  pollutanttype: global.pollutanttype,
}))
class HourData extends Component {
  render() {
    return (
      <div
        style={{ width: '100%',
      height: 'calc(100vh - 120px)' }}
      >
        {'小时数据'}
      </div>
    );
  }
}
// make this component available to the app
export default HourData;

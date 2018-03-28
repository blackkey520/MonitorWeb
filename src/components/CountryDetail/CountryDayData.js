// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import CountryDataList from '../CountryPointDetail/CountryDataList';
import CountryLineChart from '../CountryPointDetail/CountryLineChart';

@connect(({ loading, monitor, global }) => ({
  ...loading,
  columns: monitor.columns,
  data: monitor.data,
  pollutanttype: global.pollutanttype,
}))
class CountryDayData extends Component {
  render() {
    return (
      <div
        style={{ width: '100%',
      height: 'calc(100vh - 120px)', }}
      >
        <Row gutter={8}>
          <Col span={19} ><CountryLineChart  dataType={this.props.dataType}/></Col>
          <Col span={5} > <CountryDataList dataType={this.props.dataType} dataType={this.props.pointType}/></Col>
        </Row>
      </div>
    );
  }
}
// make this component available to the app
export default CountryDayData;

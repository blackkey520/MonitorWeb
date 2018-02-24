// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import DataList from '../PointDetail/DataList';
import LineChart from '../PointDetail/LineChart';

@connect(({ loading, monitor, global }) => ({
  ...loading,
  columns: monitor.columns,
  data: monitor.data,
  pollutanttype: global.pollutanttype,
}))
class RealTimeData extends Component {
  render() {
    return (
      <div
        style={{ width: '100%',
      height: 'calc(100vh - 120px)' }}
      >
        <Row gutter={8}>
          <Col >
            <div style={{ backgroundColor: 'red' }} >
              <LineChart />
            </div>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col >
            <div style={{ backgroundColor: 'blue' }} >
              <DataList />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
// make this component available to the app
export default RealTimeData;
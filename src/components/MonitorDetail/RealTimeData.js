// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import DataList from '../PointDetail/DataList';
import LineChart from '../PointDetail/LineChart';

class RealTimeData extends Component {
  render() {
    return (
      <div
        style={{ width: '100%',
      height: 'calc(100vh - 120px)', }}
      >
        <Row gutter={8}>
          <Col span={20} ><LineChart  /></Col>
          <Col span={4} > <DataList /></Col>
        </Row>
      </div>
    );
  }
}
// make this component available to the app
export default RealTimeData;

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
          <Col span={19} ><LineChart  dataType={this.props.dataType} /></Col>
          <Col span={5} > <DataList /></Col>
        </Row>
      </div>
    );
  }
}
// make this component available to the app
export default RealTimeData;

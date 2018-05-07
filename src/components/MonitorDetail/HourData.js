// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col ,Spin} from 'antd';
import DataList from '../PointDetail/DataList';
import LineChart from '../PointDetail/LineChart';

@connect(({ loading, monitor, global }) => ({
  loading:loading.effects['points/querypointdata'],
}))
class HourData extends Component {
  render() {
    const {   effects } = this.props;
    return (
      <div
        style={{ width: '100%',
      height: 'calc(100vh - 120px)', }}
      >
         <Spin spinning={this.props.loading}>
        <Row gutter={8}>
          <Col span={19} ><LineChart  dataType={this.props.dataType}/></Col>
          <Col span={5} > <DataList /></Col>
        </Row> 
        </Spin>
      </div>
    );
  }
}
// make this component available to the app
export default HourData;

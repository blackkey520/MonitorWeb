// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col ,Spin} from 'antd';
import DataList from '../PointDetail/DataList';
import LineChart from '../PointDetail/LineChart';

@connect(({ loading, monitor, global }) => ({
  ...loading,
  columns: monitor.columns,
  data: monitor.data,
  pollutanttype: global.pollutanttype,
}))
class HourData extends Component {
  render() {
    const {   effects } = this.props;
    return (
      <div
        style={{ width: '100%',
      height: 'calc(100vh - 120px)', }}
      >

         {effects['points/querychartpointdata']?<Spin style={{width: '100%',
        height: 'calc(100vh - 260px)',marginTop:260 }} size="large" />:
        <Row gutter={8}>
          <Col span={19} ><LineChart  dataType={this.props.dataType}/></Col>
          <Col span={5} > <DataList /></Col>
        </Row> }
      </div>
    );
  }
}
// make this component available to the app
export default HourData;

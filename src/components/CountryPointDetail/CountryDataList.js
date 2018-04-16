// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { List, Avatar, Button, Spin, Row, Col } from 'antd';
import styles from './CountryDataList.less';

@connect(({ loading, points }) => ({
  ...loading,
  data: points.data,
  current: points.current,
  total: points.total,
  size: points.size,
  querydate: points.querydate,
  monitortype: points.monitortype,
  selpoint: points.selpoint,
  selpollutant: points.selpollutant,
  dateformat: points.dateformat,
}))
class CountryDataList extends Component {
     
    onLoadMore = () => {

      this.props.dispatch({
      
        type: 'points/querypointdata',
        payload: {
          dgimn: this.props.selpoint.Point.Dgimn,
          current: this.props.current + 1,
          querydate: this.props.querydate,
          monitortype: this.props.monitortype,
          pollutant: this.props.selpollutant,
          dateformat: this.props.dateformat,
          pointType:"country"
        },  
      });
    }
    render() {
      const { effects, current, total, size, data } = this.props;
  
      const loadMore = current * size <= total ? (
        <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
          {effects['points/querypointdata'] && <Spin />}
          {!effects['points/querypointdata'] && <Button onClick={this.onLoadMore}>加载更多</Button>}
        </div>
      ) : null;
      const showloading = current === 1 && effects['points/querypointdata'];

      return (

        <div
          style={{
                width: '100%',
                height: 'calc((100vh - 200px)',
                backgroundColor: '#fff',
                borderLeftColor: '#e8e8e8',
                borderLeftWidth: 1,
                borderLeftStyle: 'solid',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
          <List
            loading={showloading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={data != null ? data : []}
            header={
              <div> <Row gutter={8}>
                <Col span={14} align="middle" justify="center">监控时间</Col>
                <Col span={10} align="middle" justify="center">
                  <div style={{ borderLeftColor: '#e8e8e8',
                borderLeftWidth: 1,
                borderLeftStyle: 'solid' }}
                >浓度
                  </div>
                </Col>
              </Row>
              </div>
                    }
            renderItem={item => (
              <div   style={{
                    borderBottomColor: '#e8e8e8',
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                height:30,
                lineHeight:'30px'
              }}
              > <Row gutter={8}>
                <Col span={14} align="middle" justify="center">{item.MonitorTime}</Col>
                <Col span={10} align="middle" justify="center">   <div style={{ color: item.color,
borderLeftColor: '#e8e8e8',
                borderLeftWidth: 1,
                borderLeftStyle: 'solid' }}
                >{ item.MonitorValue }
                </div>
                </Col>
                </Row>
              </div>
                    )}
          />
        </div>
      );
    }
}
// make this component available to the app
export default CountryDataList;

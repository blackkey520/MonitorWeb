// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import  {Table ,List, Avatar, Button, Spin, Row, Col } from 'antd';
import styles from './DataList.less';

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
  columns:points.columns,
  Tablewidth:points.Tablewidth,
  countryArray:points.countryArray
}))
class DataList extends Component {
      
    onLoadMore = () => {
      this.props.dispatch({
        type: 'points/querypointdata',
        payload: {
          dgimn: this.props.selpoint.DGIMN,
          current: this.props.current + 1,
          querydate: this.props.querydate,
          monitortype: this.props.monitortype,
          pollutant: this.props.selpollutant,
          dateformat: this.props.dateformat,
          countrydgimn:this.props.countryArray,
        },
      });
    }
    render() {
      
      const { effects, current, total, size, data } = this.props;
     // const showloading = current === 1 && effects['points/querypointdata'];
      const loadMore = () =>   { return current * size <= total ? 
     (
         <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
          {effects['points/querypointdata'] && <Spin />}
          {!effects['points/querypointdata'] && <Button onClick={this.onLoadMore}>加载更多</Button>}
        </div>
      ) : null};
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
           <Table size='small' rowKey="MonitorTime" footer={loadMore}  pagination={false}  bodyStyle={{ height: 'calc(100vh - 320px)' }}
            columns={this.props.columns}
            dataSource={data != null ? data : [] }
            scroll={{ x: this.props.Tablewidth ,y:true }}
          />
        </div>
      );
    }
}
// make this component available to the app
export default DataList;

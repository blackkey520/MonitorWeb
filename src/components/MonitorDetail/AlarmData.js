// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin,Table,Button} from 'antd';
import moment from 'moment';

@connect(({ loading, points, alarm }) => ({
  effects:loading.effects,
  loading:loading.effects['alarm/getAlarmHistoryList'],
  data: alarm.data,
  current: alarm.current,
  total: alarm.total,
  size: alarm.size,
  querydate: alarm.querydate,
  selpoint: points.selpoint,
  columns:alarm.columns,
  Tablewidth:alarm.Tablewidth,
  verifyState:alarm.verifyState
}))
class AlarmData extends Component {
  onLoadMore = () => {
    const beginTime=this.props.querydate[0];
    const endTime=this.props.querydate[1];
    this.props.dispatch({
      type: 'alarm/getAlarmHistoryList',
      payload: {
        dgimn: this.props.selpoint.DGIMN,
        current: this.props.current + 1,
        pageindex: this.props.current + 1,
        beginTime: beginTime,
        endTime: endTime,
        pagesize: this.props.size,
        querydate:[beginTime,endTime],
        verifyState:this.props.verifyState
      },
    });
  }

  render() {
    const { effects, current, total, size, data } = this.props;
     const loadMore = () =>   { return current * size < total ? 
    (
        <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
         {effects['alarm/getAlarmHistoryList'] && <Spin />}
         {!effects['alarm/getAlarmHistoryList'] && <Button onClick={this.onLoadMore}>加载更多</Button>}
       </div>
     ) : null};
    return (
      <div
        style={{ width: '100%',
    height: 'calc(100vh - 120px)' }}
      >
      <Spin spinning={this.props.loading}>
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
          }}>
          <Table size='small' rowKey="AlarmTime" footer={loadMore}  pagination={false}  bodyStyle={{ height: 'calc(100vh - 320px)' }}
            columns={this.props.columns}
            dataSource={data != null ? data : [] }
            scroll={{ x: this.props.Tablewidth ,y:true }}
          />
        </div>
      </Spin>
      </div>
    );
  }
}
// make this component available to the app
export default AlarmData;

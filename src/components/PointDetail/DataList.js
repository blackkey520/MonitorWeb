// import liraries
import React, {Component} from 'react';
import {connect} from 'dva';
import {  List, Avatar, Button, Spin,Row, Col } from 'antd';
import styles from './DataList.less'

@connect(({loading,points}) => ({
    ...loading,
    data: points.data,
    current:points.current,
    total:points.total,
    size:points.size,
    querydate:points.querydate,
    monitortype:points.monitortype,
    selpoint:points.selpoint,
    selpollutant:points.selpollutant,
}))
class DataList extends Component {
    onLoadMore = () => {
        this.props.dispatch({
            type: 'points/querypointdata',
            payload:{
              dgimn: this.props.selpoint.Point.Dgimn,
              current:this.props.current+1,
              querydate:this.props.querydate,
              monitortype:this.props.monitortype,
              pollutant:this.props.selpollutant,
            },
          });
    }
    render() {
        const {effects,current,total,size,data}=this.props;
        const loadMore = current*size<=total ? (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
              {effects['monitor/querypointdata'] && <Spin />}
              {!effects['monitor/querypointdata'] && <Button onClick={this.onLoadMore}>加载更多</Button>}
            </div>
          ) : null;
        return (
            <div
                style={{
                width: '100%',
                height: 'calc((100vh - 200px)',
                backgroundColor:'#fff',
                borderLeftColor:'#e8e8e8',
                borderLeftWidth:1,
                borderLeftStyle:'solid',
                overflowY:'auto',
                overflowX:'hidden',
            }}  >
                <List
                    loading={false}
                    itemLayout="horizontal"
                    loadMore={loadMore}
                    dataSource={data}
                    header={
                        <div> <Row gutter={8}>
                    <Col span={12} align={'middle'} justify={'center'}>{'监控时间'}</Col>
                    <Col span={12} align={'middle'} justify={'center'}> {'浓度'}</Col>
                  </Row></div>
                    }
                    renderItem={item => (
                    <div> <Row gutter={8}>
                    <Col span={12} align={'middle'} justify={'center'}>{item.MonitorTime}</Col>
                    <Col span={12} align={'middle'} justify={'center'}> {item.MonitorValue}</Col>
                  </Row></div>
                    )}
                />
            </div>
        );
    }
}
// make this component available to the app
export default DataList;

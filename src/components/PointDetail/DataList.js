// import liraries
import React, {Component} from 'react';
import {connect} from 'dva';

@connect(({loading, monitor, global}) => ({
    ...loading,
    columns: monitor.columns,
    data: monitor.data,
    pollutanttype: global.pollutanttype
}))
class DataList extends Component {
    render() {
        return (
            <div
                style={{
                width: '100%',
                height: 'calc((100vh - 200px)/2',
                backgroundColor:'red'
            }}>
                {'数据列表'}
            </div>
        );
    }
}
// make this component available to the app
export default DataList;

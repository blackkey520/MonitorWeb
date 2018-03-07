// import liraries
import React, {Component} from 'react';
import {connect} from 'dva';

@connect(({loading, monitor, global}) => ({
    ...loading,
    columns: monitor.columns,
    data: monitor.data,
    pollutanttype: global.pollutanttype
}))
class LineChart extends Component {
    render() {
        return (
            <div
                style={{
                width: '100%',
                height: 'calc((100vh - 180px)/2',
                backgroundColor:'#fff'
            }}>
                {'曲线图'}
            </div>
        );
    }
}
// make this component available to the app
export default LineChart;

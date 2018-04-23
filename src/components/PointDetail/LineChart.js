// import liraries
import React, {Component} from 'react';
import {connect} from 'dva';
import FoldlineBar from '../Charts/foldline'

@connect(({loading, monitor, global, points}) => ({
    ...loading,
    columns: monitor.columns,
    data: points.data,
    pollutanttype: global.pollutanttype,
    countryArray:points.countryArray,
    pointName:points.pointName,
    levels:points.levels
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
            <FoldlineBar dataType={this.props.dataType} pointName={this.props.pointName}  countryArray={this.props.countryArray}  data={this.props.data} levels={this.props.levels} />
            </div>
        );
    }
}
// make this component available to the app
export default LineChart;

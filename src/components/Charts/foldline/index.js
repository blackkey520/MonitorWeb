import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom,Legend } from 'bizcharts';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';
import DataSet from '@antv/data-set';

class FoldlineBar extends Component{

render() {
   
    const {
      height,
      title,
      forceFit = true,
      pollutant,
      color = 'rgba(24, 144, 255, 0.85)',
      padding, 
      data,
    } = this.props;
      
    let dataType=this.props.dataType
      const ds = new DataSet(
      );
      data.map((item,key)=>{
       
        if(dataType=="realTime")
        {
          item.timeY= moment(item.MonitorTime).format('H:mm:ss');
        }
        if(dataType=="minute")
        {
          item.timeY=  moment(item.MonitorTime).format('H:mm:ss');
        }
        if(dataType=="hour")
        {
          item.timeY=  moment(item.MonitorTime).format('YYYY-MM-DD HH');
        }
        if(dataType=="day")
        {
          item.timeY= item.MonitorTime;
        }
      })
      const dv = ds.createView().source(data);
      dv.transform({
        type: 'fold',
        fields: [ 'MonitorValue' ], // 展开字段集
        key: 'dt', // key字段
        value: 'value', // value字段
      });
      const cols = {
        MonitorTime: {
           range: [ 0, 1 ]
        } ,
        tickCount: 5
      }
     
    return(
        <Chart height={850} data={dv} scale={cols} forceFit style={{marginTop:30}}  > 
        <Legend />
        <Axis name="timeY"  />
        <Axis name="value" label={{formatter: val => `${val}`}}/>
        <Tooltip crosshairs={{type : "y"}}/>
        <Geom type="line" position="timeY*value" size={2} color={'dt'} shape={'smooth'} />
        <Geom type='point' position="timeY*value" size={4} shape={'circle'} color={'dt'} style={{ stroke: '#fff', lineWidth: 1}} />
      </Chart>
   );
}
}
export default FoldlineBar;
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
      pollutant,
      color = 'rgba(24, 144, 255, 0.85)',
      title,
      height = 800,
      padding = [60, 20, 40, 40],
      borderWidth = 2,
      pointName,
      data=[{
        timeY:0,
      }] ,
      countryArray
    } = this.props;
    
    let pointArray= [];
    pointArray.push(pointName);
    countryArray.map((item,key)=>{
      pointArray.push(item.label);
    })
    console.log(pointName)
    let dataType=this.props.dataType
     
      data.map((item,key)=>{
       
        if(dataType=="realTime")
        {
          item.timeY= moment(item.MonitorTime).format('HH:mm:ss');
        }
        if(dataType=="minute")
        {
          item.timeY=  moment(item.MonitorTime).format('HH:mm:ss');
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
        let max;
        let ds = new DataSet();
        if(data.length>0)
        {
            ds = new DataSet({
            state: {
              start: data[0].MonitorTime,
              end: data[data.length - 1].MonitorTime,
            },
          });
        }
        const dv = ds.createView();
        dv
          .source(data)
          .transform({
            type: 'map',
            callback(row) {
              const newRow = { ...row };
              newRow[pointName] = row.MonitorValue;
             
              countryArray.map((key,item)=>{
                newRow[key.label]=row[key.key]
              })
              return newRow;
            },
          })
          .transform({
            type: 'fold',
            fields: pointArray, // 展开字段集
            key: 'key', // key字段
            value: 'value', // value字段
          });
    
        const timeScale = {
          tickCount: 15,
          range: [0, 1],
        };
    
        const cols = {
          timeY: timeScale,
          value: {
            max,
            min: 0,
          },
        };
 
     
    
        return (
          <div  style={{ height: height + 30 }}>
            <div>
              {title && <h4>{title}</h4>}
              <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
                <Axis name="timeY" />
                <Tooltip />
                <Legend name="key" position="top" />
                <Geom type="line" position={'timeY*value'} size={borderWidth} color="key" />
              </Chart>
            </div>
          </div>
        );
      }
}
export default FoldlineBar;
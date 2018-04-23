import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom,Legend,Guide} from 'bizcharts';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';
import DataSet from '@antv/data-set';
const Line=Guide.Line;
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
      countryArray,
      levels
    } = this.props;
    let pointArray= [];
    pointArray.push(pointName);
    countryArray.map((item,key)=>{
      pointArray.push(item.label);
    })
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
                <Geom type='point' position={'timeY*value'} size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}} />
                <Guide>
                  {
                    levels.map((item, key) => {
                      let levelName='';
                      switch (item.AlarmLevel) {
                        case 1:
                        levelName='一级报警';
                        break;
                        case 2:
                        levelName='二级报警';
                        break;
                        case 3:
                        levelName='三级报警';
                        break;
                        default:
                        break;
                      }
                      return (<Line
                        start={['min', item.UpperValue]}
                        end={['max', item.UpperValue]}
                        lineStyle={{
                          stroke: item.StandardColor, // 线的颜色
                          lineDash: [0, 2, 2], // 虚线的设置
                          lineWidth: 1 // 线的宽度
                        }} // 图形样式配置
                        text={{
                          position: 'end', // 文本的显示位置
                          style: {
                            fill: '#666', // 文本颜色
                            fontSize: 13, // 文本大小
                            fontWeight: 'bold' // 文本粗细
                          }, // 文本图形样式配置 
                          content: levelName, // 文本的内容
                          offsetX: -30, // x 方向的偏移量
                          offsetY: 20 // y 方向的偏移量
                        }} />);
                    })
                  }
                </Guide>
              </Chart>
            </div>
          </div>
        );
      }
}
export default FoldlineBar;
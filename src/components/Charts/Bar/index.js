import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
import moment from 'moment';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
class Bar extends Component {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
    const canvasWidth = this.node.parentNode.clientWidth;
    const { data = [], autoLabel = true } = this.props;
    if (!autoLabel) {
      return;
    }
    const minWidth = data.length * 30;
    const { autoHideXLabels } = this.state;

    if (canvasWidth <= minWidth) {
      if (!autoHideXLabels) {
        this.setState({
          autoHideXLabels: true,
        });
      }
    } else if (autoHideXLabels) {
      this.setState({
        autoHideXLabels: false,
      });
    }
  }

  handleRoot = (n) => {
    this.root = n;
  };

  handleRef = (n) => {
    this.node = n;
  };

  render() {
    const {
      height,
      title,
      forceFit = true,
      pollutant,
      data,
      color = 'rgba(24, 144, 255, 0.85)',
      padding,
    } = this.props;

    const { autoHideXLabels } = this.state;

    const scale = {
      x: {
        type: 'cat',
        formatter: (value) => {
          return moment(value).format('HH');
        },
      },
      y: {
        min: 0,
      },
    };

    const tooltip = ['x*y', (x, y) => {
      return {
        // 自定义 tooltip 上显示的 title 显示内容等。
        time: `时间:${moment(x).format('DD 日 HH 时')}`,
        value: `数值:${y}(${pollutant.Unit})`,
      };
    }];

    return (
      <div className={styles.chart} style={{ height }} ref={this.handleRoot}>
        <div ref={this.handleRef}>
          {title && <h4>{pollutant.PollutantName + title}</h4>}
          <Chart
            scale={scale}
            height={title ? height - 41 : height}
            forceFit={forceFit}
            data={data}
            padding={{ top: 5, right: 5, bottom: 27, left: 25 }}
          >
            <Axis name="x" />
            <Axis name="y" />
            <Tooltip itemTpl="<div>{time}<br/> {value}</div>" showTitle={false} crosshairs={false} />
            <Geom type="interval" position="x*y" color={color} tooltip={tooltip} />
          </Chart>
        </div>
      </div>
    );
  }
}

export default Bar;

import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { Bar } from '../../components/Charts';
import styles from './index.less';
// TODO: 添加逻辑
class MarkerDetail extends PureComponent {
  renderContent=(effects, lastdata, hourtendency) => {
    if (effects['points/querypointlastdata'] || effects['points/queryhourtendency']) {
      return (<div style={{ height: 80, width: 250, textAlign: 'center', marginTop: 50 }}><Spin size="small" /></div>);
    } else if (lastdata.length === 0) {
      return (<div style={{ height: 80, width: 250, textAlign: 'center', marginTop: 50 }}>没有查询到数据</div>);
    } else {
      return (
        <div>
          {
            this.renderLastData(lastdata)
          }
          <Bar height={120} title="监测趋势" data={hourtendency} />
        </div>
      );
    }
  }
  renderLastData=(lastdata) => {
    return (<table className={styles.gridtable}>
      <tr><td>监测时间</td><td colSpan="3" >{lastdata[0].Time}</td></tr>
      {
          this.renderitem(lastdata)
        }
    </table>);
  }
  renderitem=(datas) => {
    const doms = [];
    for (let i = 0; i < datas.length; i++) {
      if (i % 2 !== 1) {
        if (datas[i + 1]) {
          doms.push(<tr><td>{`${datas[i].PollutantName}(${datas[i].Unit})`}</td><td>{datas[i].Value}</td>
            <td>{`${datas[i + 1].PollutantName}(${datas[i + 1].Unit})`}</td><td>{datas[i + 1].Value}</td>
          </tr>);
        } else {
          doms.push(
            <tr><td>{`${datas[i].PollutantName}(${datas[i].Unit})`}</td>
              <td>{datas[i].Value}</td><td /><td />
            </tr>);
        }
      }
    }
    return doms;
  }
  render() {
    const { selectpoint, hourtendency, lastdata, effects } = this.props;

    return (
      <div className="infowindow-content" style={{ width: 260 }}>
        <div className="amap-info-header" >{`${selectpoint.targetName}-${selectpoint.pointName}`}<a style={{ float: 'right' }}>详情</a></div>
        <div className="amap-info-body">
          {
            this.renderContent(effects, lastdata, hourtendency)
          }
        </div>
      </div>
    );
  }
}

export default MarkerDetail;

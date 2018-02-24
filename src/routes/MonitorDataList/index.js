// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Radio, Select, Cascader, Input, Card, Modal } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import city from '../../utils/city';
import styles from './index.less';
import BreadcrumbHeader from '../../components/BreadcrumbHeader';
import MonitorDetail from '../../components/MonitorDetail';
import { getRoutes } from '../../utils/utils';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const InputGroup = Input.Group;
const Search = Input.Search;


@connect(({ loading, monitor, global, points }) => ({
  ...loading,
  columns: monitor.columns,
  data: monitor.data,
  showdetail: points.showdetail,
  selpoint: points.selpoint,
  pollutanttype: global.pollutanttype,
}))
class MonitorDataList extends Component {
  render() {
    const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
    const SCREEN_WIDTH = document.querySelector('body').offsetWidth;
    const { location, data, columns, pollutanttype, effects, match, routerData } = this.props;
    const { payload = {}, pathname } = location;
    const listProps = {
      dataSource: data,
      columns,
      loading: effects['monitor/querypointdetail'],
      pagination: false,
      scroll: {
        y: SCREEN_HEIGHT - 300,
        x: columns.length * 180,
      },
      bordered: true,
    };
    const routes = getRoutes(match.path, routerData);

    return (
      <div
        style={{ width: '100%',
      height: 'calc(100vh - 120px)' }}
        className={styles.standardList}
      >
        <Card
          bordered={false}
          bodyStyle={
            {
              height: 'calc(100vh - 200px)',
              padding: '0px 20px',
            }
          }
          title={<BreadcrumbHeader />}
          extra={<div >
            <RadioGroup
              onChange={({ target }) => {
        let time = moment().format('YYYY-MM-DD HH:mm:ss');
        if (moment().minute() < 10) {
          time = moment().add(-1, 'hours').format('YYYY-MM-DD HH:mm:ss');
        }
        this.props.dispatch(routerRedux.push(
          {
            type: 'monitor/querydata',
            payload: {
              ...payload,
              searchTime: time,
              monitortype: target.value,
            },
          }
        ));
      }}
              defaultValue="realtime"
              size="default"
              style={{ marginLeft: 10 }}
            >
              <RadioButton value="realtime"> 实时 </RadioButton>
              <RadioButton value="minute"> 分钟 </RadioButton>
              <RadioButton value="hour"> 小时 </RadioButton>
              <RadioButton value="day"> 日均 </RadioButton>
            </RadioGroup>
            <Cascader options={city}placeholder="请选择行政区" style={{ width: 250, marginLeft: 10 }} />
            <Select
              onChange={(value) => {
                this.props.dispatch(routerRedux.push(
                  {
                    type: 'monitor/querydata',
                    payload: {
                      ...payload,
                      pollutantType: value,
                    },
                  }
                ));
            }}
              defaultValue={pollutanttype[0].Name}
              size="default"
              style={{ width: 100, marginLeft: 10 }}
            >
              {
            pollutanttype.map((item, key) => {
              return <Option key={key} value={item.ID}>{item.Name}</Option>;
            })
        }
            </Select>

            <Search
              placeholder="输入条件模糊搜索"
              style={{ width: 270, marginLeft: 10 }}
              onSearch={value => console.log(value)}
            />
                 </div>}

        >
          <Table
            {...listProps}
            onRow={record => ({
              onClick: () => {
                this.props.dispatch({
                  type: 'points/querypointdetail',
                  payload: record,
                });
              },
            })}
          />

        </Card >
        <Modal
          title={this.props.selpoint !== null ? `${this.props.selpoint.Point.TargetName}-${this.props.selpoint.Point.PointName}` : '详细信息'}
          visible={this.props.showdetail}
          width={SCREEN_WIDTH - 40}
          style={{ top: 20 }}
          bodyStyle={{ padding: 5 }}
          onCancel={() => {
            this.props.dispatch({
                  type: 'points/hidedetail',
                });
          }}
          footer={null}
        >
          <MonitorDetail {...this.props} />
        </Modal>

      </div>
    );
  }
}
// make this component available to the app
export default MonitorDataList;

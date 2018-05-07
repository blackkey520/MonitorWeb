// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Radio, Select, Cascader, Input, Card, Modal,Spin } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import city from '../../utils/city';
import styles from './index.less';
import BreadcrumbHeader from '../../components/BreadcrumbHeader';
import MonitorDetail from '../../components/MonitorDetail';
import CountryDetail from '../../components/CountryDetail';
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
  selpoint: points.selpoint,
  pollutanttype: global.pollutanttype,
}))
class MonitorDataList extends Component {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.state = {
      showdetail:false,
      countryshowdetail:false
    };
  }
  render() {
    const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
    const SCREEN_WIDTH = document.querySelector('body').offsetWidth;
    const { location, data, columns, pollutanttype, effects, match, routerData } = this.props;
    const { payload = {}, pathname } = location;
    const listProps = {
      dataSource: data,
      className:styles.globaltable,
      columns,
      loading: effects['monitor/querydata'],
      pagination: false,
      scroll: {
        y: SCREEN_HEIGHT - 300,
        x: columns.length * 180,
      },
      bordered: true,
    };
    const routes = getRoutes(match.path, routerData);
    let monitortype="realtime";
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
          extra={<div>
            <RadioGroup
              onChange={({ target }) => {
        monitortype=target.value;
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
            <Cascader
            onChange={(value, selectedOptions)=>{
              let code;
              if(selectedOptions.length==3){
                code=selectedOptions[2].id;
              }
              this.props.dispatch({
                type: 'monitor/querydata',
                payload: {
                  ...payload,
                  regionCode: code,
            
                },
              }
              );
            }}
            options={city} placeholder="请选择行政区" style={{ width: 250, marginLeft: 10 }} />
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
              defaultValue={pollutanttype[0].PollutantTypeName}
              size="default"
              style={{ width: 100, marginLeft: 10 }}
            >
              {
            pollutanttype.map((item, key) => {
              return <Option key={key} value={item.PollutantTypeCode}>{item.PollutantTypeName}</Option>;
            })
        }
            </Select>

            <Search
              placeholder="输入条件模糊搜索"
              style={{ width: 270, marginLeft: 10 }}
              onSearch={value => { 
                this.props.dispatch(routerRedux.push(
                  {
                    type: 'monitor/querydata',
                    payload: {
                      ...payload,
                      keyWords:value
                    },
                  }
                ));
              }}
            />
                 </div>}

        >
          <Table
            {...listProps}
            bodyStyle={{ height: 'calc(100vh - 300px)' }}
            onRow={record => ({
              onClick: () => {
                this.setState({
                    showdetail:true,
                    countryshowdetail:false
                });
                this.props.dispatch({
                  type: 'points/querypointdetail',
                  payload: record,
                });
              },
            })}
          />

        </Card >
        <Modal
          title={this.props.selpoint !== null ? `${this.props.selpoint.parentName}-${this.props.selpoint.pointName}` : '详细信息'}
          visible={this.state.showdetail}
          width={SCREEN_WIDTH - 40}
          style={{ top: 20 }}
          bodyStyle={{ padding: 5 }}
          onCancel={() => {
            this.setState({
              showdetail:false
            });
          }}
          footer={null}
        >
          {effects['points/querypointdetail']?<Spin style={{width: '100%',
        height: 'calc(100vh - 260px)',marginTop:130 }} size="large" />:<MonitorDetail {...this.props} />}
        </Modal>
      </div>
    );
  }
}
// make this component available to the app
export default MonitorDataList;

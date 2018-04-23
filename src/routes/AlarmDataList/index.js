// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Radio, Select, Cascader, Input, Card, Modal,Spin,DatePicker  } from 'antd';
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
const RangePicker = DatePicker.RangePicker;


@connect(({ loading, monitor, global, points }) => ({
  ...loading,
  columns: monitor.columns,
  data: monitor.data,
  selpoint: points.selpoint,
  pollutanttype: global.pollutanttype,
}))
class AlarmDataList extends Component {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.state = {
      showdetail:false,
      dateformat: 'YYYY-MM-DD',
      querydate: [moment().add(-30, 'm'), moment()],
    };
  }
  onDateChange=(dates, dateStrings) => {
    this.setState({
      querydate: dates,
    });
  }
  onDateOK=() => {
    this.props.dispatch({
      type: 'points/querypointdata',
      payload: {
        dgimn: this.props.selpoint.Point.Dgimn,
        current: 1,
        ...this.state,
      },
    });
  }
  render() {
    const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
    const SCREEN_WIDTH = document.querySelector('body').offsetWidth;
    const { location, data, columns, pollutanttype, effects, match, routerData } = this.props;
    const { payload = {}, pathname } = location;
    const listProps = {
      dataSource: data,
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



    const columnssss = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      fixed: 'left',
      filters: [{
        text: 'Joe',
        value: 'Joe',
      }, {
        text: 'John',
        value: 'John',
      }],
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    }, {
      title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 200,
        sorter: (a, b) => a.age - b.age,
      }, {
        title: 'Street',
          dataIndex: 'street',
          key: 'street',
          width: 200,
        }, {
          title: 'Building',
          dataIndex: 'building',
          key: 'building',
          width: 100,
        }, {
          title: 'Door No.',
          dataIndex: 'number',
          key: 'number',
          width: 100,
    }, {
      title: 'Company Address',
      dataIndex: 'companyAddress',
      key: 'companyAddress',
    }, {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    }, {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 60,
      fixed: 'right',
    }];
    
    const datasss = [];
    for (let i = 0; i < 100; i++) {
      datasss.push({
        key: i,
        name: 'John Brown'+i,
        age: i + 1,
        street: 'Lake Park'+i,
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street',
        companyName: 'SoftLake Co',
        gender: 'M',
      });
    }
    

    return (
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 120px)'
        }}
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
            <Radio.Group onChange={this.handleSizeChange}>
              <Radio.Button value="3">参照参数及状态预警</Radio.Button>
              <Radio.Button value="5">机器学习预警</Radio.Button>
              <Radio.Button value="1">限值报警</Radio.Button>
              <Radio.Button value="2">参照其他点位报警</Radio.Button>
              <Radio.Button value="4">设备本身报警</Radio.Button>
              <Radio.Button value="6">缺失报警</Radio.Button>
            </Radio.Group>
            <Search
              placeholder="请输入监控目标搜索"
              style={{ width: 270, marginLeft: 10 }}
              onSearch={value => console.log(value)}
            />
            
            <RangePicker 
              placeholder={["首次报警开始日期","结束日期"]}
              renderExtraFooter={() => ''} 
              showTime             
              format={this.state.dateformat}
              onChange={this.onDateChange}
              //onOk={this.onDateOK}
              style={{marginLeft:10}}
              />
          </div>}
        >
        <Table
          columns={columnssss}
          dataSource={datasss}
          bordered
          size="middle"
          scroll={{ x: '130%' }}
          pagination={
            {position:'both',showSizeChanger:true,defaultPageSize:15,pageSizeOptions:[10,15,50,100,300]}
          }
        />

        </Card >
        <Modal
          title={this.props.selpoint !== null ? `${this.props.selpoint.Point.TargetName}-${this.props.selpoint.Point.PointName}` : '详细信息'}
          visible={this.state.showdetail}
          width={SCREEN_WIDTH - 40}
          style={{ top: 20 }}
          bodyStyle={{ padding: 5 }}
          onCancel={() => {
            this.setState({
              showdetail: false
            });
          }}
          footer={null}
        >
          {effects['points/querypointdetail'] ? <Spin style={{
            width: '100%',
            height: 'calc(100vh - 260px)', marginTop: 130
          }} size="large" /> : <MonitorDetail {...this.props} />}
        </Modal>

      </div>
    );
  }
}
export default AlarmDataList;

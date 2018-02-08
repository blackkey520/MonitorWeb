// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Card } from 'antd';
import { routerRedux, Switch, Route } from 'dva/router';
import BreadcrumbHeader from '../../components/BreadcrumbHeader';
import { getRoutes } from '../../utils/utils';

const { TabPane } = Tabs;

@connect(({ loading }) => ({
  ...loading,
}))
class MonitorDetail extends Component {
  onChange=(key) => {
    const { dispatch, match } = this.props;
    dispatch(routerRedux.push(`${match.url}/${key}`));
  }
  render() {
    const { match, routerData } = this.props;
    const tablist = [{ key: 'realtime', tab: '实时数据' }, { key: 'minute', tab: '分钟数据' }, { key: 'hour', tab: '小时数据' }, { key: 'day', tab: '日数据' }];
    const routes = getRoutes(match.path, routerData);
    return (
      <div
        style={{ width: '100%',
      height: 'calc(100vh - 120px)' }}
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
        >
          
          <Tabs onChange={this.onChange}>
            {
                tablist.map(item => <TabPane tab={item.tab} key={item.key} />)
           }
          </Tabs>
          <Switch>
            {
                routes.map(item => (<Route key={item.key} path={item.path} component={item.component} exact={item.exact} />))
            }
          </Switch>
        </Card>
        {this.props.match.params.pointid}
      </div>
    );
  }
}
// make this component available to the app
export default MonitorDetail;

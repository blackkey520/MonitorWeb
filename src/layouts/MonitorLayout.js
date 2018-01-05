
import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import MonitorHeader from '../components/MonitorHeader';
import GlobalFooter from '../components/GlobalFooter';
import NotFound from '../routes/Exception/404';
import config from '../config';
import { getRoutes } from '../utils/utils';
import { getMenuData } from '../common/menu';
import AuthorizedRoute from '../components/AuthorizedRoute';

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({ from: `/${item.path}`, to: `/${item.children[0].path}` });
      item
        .children
        .forEach((children) => {
          getRedirect(children);
        });
    }
  }
};
getMenuData().forEach(getRedirect);
const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class MonitorLayout extends React.PureComponent {
    static childContextTypes = {
      location: PropTypes.object,
      breadcrumbNameMap: PropTypes.object,
      routeData: PropTypes.array,
    }

    getChildContext() {
      const { location } = this.props;
      return { location };
    }
    // componentDidMount() {
    //   this.props.dispatch({
    //     type: 'global/fetchPollutantType',
    //   });
    // }

    getPageTitle() {
      const { routerData, location } = this.props;
      const { pathname } = location;
      let title = config.name;
      if (routerData[pathname] && routerData[pathname].name) {
        title = `${routerData[pathname].name} - ${config.name}`;
      }
      return title;
    }
    render() {
      const {
        currentUser, collapsed, fetchingNotices, notices, match, navData, location, dispatch, routerData,
      } = this.props;
      const layout = (
        <Layout className="layout">
          <MonitorHeader
            location={location}
            navData={navData}
            currentUser={currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            dispatch={dispatch}
          />

          <Content style={{ margin: ' 10px 10px 0 10px ', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  redirectData.map(item =>
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  )
                }
                {
                  getRoutes(match.path, routerData).map(item => (
                    <AuthorizedRoute
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  ))
                }
                <Redirect exact from="/" to={getMenuData()[0].path} />
                <Route render={NotFound} />
              </Switch>
            </div>

          </Content>
          <GlobalFooter
            links={[]}
            copyright={
              <div>
              Copyright <Icon type="copyright" />{config.footerText}
              </div>
          }
          />
        </Layout>
      );

      return (
        <DocumentTitle title={this.getPageTitle()}>
          <ContainerQuery query={query}>
            {params => <div className={classNames(params)}>{layout}</div>}
          </ContainerQuery>
        </DocumentTitle>
      );
    }
}

export default connect(state => ({
  currentUser: state.user.currentUser,
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
}))(MonitorLayout);


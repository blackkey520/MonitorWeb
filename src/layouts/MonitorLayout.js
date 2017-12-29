
import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb,Icon } from 'antd'; 
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch,Link } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import MonitorHeader from '../components/MonitorHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404'; 
import config from '../config';

const { Header, Content, Footer } = Layout; 

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
    
     
    getPageTitle() {
      const { location, getRouteData } = this.props;
      const { pathname } = location;
      let title = config.name;
      getRouteData('MonitorLayout').forEach((item) => {
        if (item.path === pathname) {
          title = `${item.name} - ${config.name}`;
        }
      });
      return title;
    } 
    render() {
      const {
        currentUser, collapsed, fetchingNotices, notices, getRouteData, navData, location, dispatch,
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
   
         <Content style={{ margin: ' 24px 24px 0 24px ',  height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  getRouteData('MonitorLayout').map(item =>
                    (
                      <Route
                        exact={item.exact}
                        key={item.path}
                        path={item.path}
                        component={item.component}
                      />
                    )
                  )
                }
                <Redirect exact from="/" to="/user/login" />
                <Route component={NotFound} />
              </Switch>
            </div>
           
          </Content>
          <GlobalFooter
          links={[{
            title: 'Pro 首页',
            href: 'http://pro.ant.design',
            blankTarget: true,
          }, {
            title: 'GitHub',
            href: 'https://github.com/ant-design/ant-design-pro',
            blankTarget: true,
          }, {
            title: 'Ant Design',
            href: 'http://ant.design',
            blankTarget: true,
          }]}
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
  

 
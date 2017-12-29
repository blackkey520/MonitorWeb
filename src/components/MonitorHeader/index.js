import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, message } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { Route, Redirect, Switch,Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import NoticeIcon from '../../components/NoticeIcon';
import HeaderSearch from '../../components/HeaderSearch';
import styles from './index.less';
import config from '../../config';
import logo from '../../assets/logo.svg';
const { Header } = Layout;
const { SubMenu } = Menu;
export default class MonitorHeader extends PureComponent {
    static childContextTypes = {
        location: PropTypes.object,
        breadcrumbNameMap: PropTypes.object,
        routeData: PropTypes.array,
      }
      constructor(props) {
          super(props);
          // 把一级 Layout 的 children 作为菜单项
          
          // this.menus = props.navData.reduce((arr, current) => arr.concat(current.children), []);
          this.menus = props.navData[0].children;
          this.state = {
            openKeys: this.getDefaultCollapsedSubMenus(props),
          };
        } 
        getDefaultCollapsedSubMenus(props) {
          const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
          currentMenuSelectedKeys.splice(-1, 1);
          if (currentMenuSelectedKeys.length === 0) {
            return ['dashboard'];
          }
          return currentMenuSelectedKeys;
        }
        getCurrentMenuSelectedKeys(props) {
          const { location: { pathname } } = props || this.props;
          const keys = pathname.split('/').slice(1);
          if (keys.length === 1 && keys[0] === '') {
            return [this.menus[0].key];
          }
          return keys;
        }
        getNavMenuItems(menusData, parentPath = '') {
          if (!menusData) {
            return [];
          }
          return menusData.map((item) => {
            if (!item.name) {
              return null;
            }
            let itemPath;
            if (item.path.indexOf('http') === 0) {
              itemPath = item.path;
            } else {
              itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
            }
            if (item.children && item.children.some(child => child.name)) {
              return (
                <SubMenu
                  title={
                    item.icon ? (
                      <span>
                        <Icon type={item.icon} />
                        <span>{item.name}</span>
                      </span>
                    ) : item.name
                  }
                  key={item.key || item.path}
                >
                  {this.getNavMenuItems(item.children, itemPath)}
                </SubMenu>
              );
            }
            const icon = item.icon && <Icon type={item.icon} />;
            return (
              <Menu.Item key={item.key || item.path}>
                {
                  /^https?:\/\//.test(itemPath) ? (
                    <a href={itemPath} target={item.target}>
                      {icon}<span>{item.name}</span>
                    </a>
                  ) : (
                    <Link
                      to={itemPath}
                      target={item.target}
                      replace={itemPath === this.props.location.pathname}
                    >
                      {icon}<span>{item.name}</span>
                    </Link>
                  )
                }
              </Menu.Item>
            );
          });
        }
        handleOpenChange = (openKeys) => {
          const lastOpenKey = openKeys[openKeys.length - 1];
          const isMainMenu = this.menus.some(
            item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
          );
          this.setState({
            openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
          });
        }
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }
  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }
  toggle = () => {
    const { collapsed } = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser, collapsed, fetchingNotices,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <Header className={styles.header}>
         
            <div className={styles.logo}>
             
                <img src={logo} alt="logo" />
                <h1>{config.name}</h1>
                 
                
            </div>
          
            <div className={styles.right}>
            <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                console.log('input', value); // eslint-disable-line
                }}
                onPressEnter={(value) => {
                console.log('enter', value); // eslint-disable-line
                }}
            />
            <NoticeIcon
                className={styles.action}
                count={currentUser.notifyCount}
                onItemClick={(item, tabProps) => {
                console.log(item, tabProps); // eslint-disable-line
                }}
                onClear={this.handleNoticeClear}
                onPopupVisibleChange={this.handleNoticeVisibleChange}
                loading={fetchingNotices}
                popupAlign={{ offset: [20, -16] }}
            >
                <NoticeIcon.Tab
                list={noticeData['通知']}
                title="通知"
                emptyText="你已查看所有通知"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                list={noticeData['消息']}
                title="消息"
                emptyText="您已读完所有消息"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
                <NoticeIcon.Tab
                list={noticeData['待办']}
                title="待办"
                emptyText="你已完成所有待办"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                />
            </NoticeIcon>
            {currentUser.name ? (
                <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                    {currentUser.name}
                </span>
                </Dropdown>
            ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
            <Menu 
            mode="horizontal"
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{ padding: '12px 0',height:'64px' }}
        >
            {this.getNavMenuItems(this.menus)}
        </Menu>
      </Header>
    );
  }
}

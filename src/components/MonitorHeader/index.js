import React, { PureComponent } from 'react';
import { connect } from 'dva';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar,Modal,Form, Input,Tooltip, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete  } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Debounce, { debounce } from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../../components/NoticeIcon';
import HeaderSearch from '../../components/HeaderSearch';
import styles from './index.less';
import config from '../../config';
import logo from '../../../public/sdlicon.png';
import MessageDetail from '../../components/MessageDetail'
import ChangePwdDetail from '../ChangePwdDetail';



const { Header } = Layout;
const { SubMenu } = Menu;

const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};
@connect( ({search})=>({
   lxsearchinfo:search.lxsearchinfo
}))
export default class MonitorHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
      showdetail: false,
      detailtitle: "",
      alarmTime: 0,
      DGIMN: "",
      datetime: null,
      oldvalue: ""
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
    
    //初始化header的时候调用一下notice事件，显示报警信息
    this.props.dispatch({
      type: 'global/getNotifyCount',
      payload:{}
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      });
    }
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


  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    // eg. /list/search/articles = > ['','list','search','articles']
    let snippets = pathname.split('/');
    // Delete the end
    // eg.  delete 'articles'
    snippets.pop();
    // Delete the head
    // eg. delete ''
    snippets.shift();
    // eg. After the operation is completed, the array should be ['list','search']
    // eg. Forward the array as ['list','list/search']
    snippets = snippets.map((item, index) => {
      // If the array length > 1
      if (index > 0) {
        // eg. search => ['list','search'].join('/')
        return snippets.slice(0, index + 1).join('/');
      }
      // index 0 to not do anything
      return item;
    });
    snippets = snippets.map((item) => {
      return this.getSelectedMenuKeys(`/${item}`)[0];
    });
    // eg. ['list','list/search']
    return snippets;
  }
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach((item) => {
      if (item.children) {
        keys.push(item.path);
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      } else {
        keys.push(item.path);
      }
    });
    return keys;
  }
    getSelectedMenuKeys = (path) => {
      const flatMenuKeys = this.getFlatMenuKeys(this.menus);
      return flatMenuKeys.filter((item) => {
        return pathToRegexp(`/${item}`).test(path);
      });
    }
    /*
    * 判断是否是http链接.返回 Link 或 a
    * Judge whether it is http link.return a or Link
    * @memberof SiderMenu
    */
    getMenuItemPath = (item) => {
      const itemPath = this.conversionPath(item.path);
      const icon = getIcon(item.icon);
      const { target, name } = item;
      // Is it a http link
      if (/^https?:\/\//.test(itemPath)) {
        return (
          <a href={itemPath} target={target}>
            {icon}<span>{name}</span>
          </a>
        );
      }
      return (
        <Link
          to={itemPath}
          target={target}
          replace={itemPath === this.props.location.pathname}
          onClick={this.props.isMobile ? () => { this.props.onCollapse(true); } : undefined}
        >
          {icon}<span>{name}</span>
        </Link>
      );
    }
  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem=(item) => {
    if (item.children && item.children.filter(it => it.name &&
       !it.hideInMenu).length !== 0 && item.children.some(child => child.name)) {
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </span>
            ) : item.name
            }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.path}>
          {this.getMenuItemPath(item)}
        </Menu.Item>
      );
    }
  }
  /**
  * 获得菜单子节点
  * @memberof SiderMenu
  */
  getNavMenuItems = (menusData) => {    
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map((item) => {
        if (item.name === '首页') {
          return this.getNavMenuItems(item.children);
        } else {
          const ItemDom = this.getSubMenuOrItem(item);
          return ItemDom;
        }
      })
      .filter(item => !!item);
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  // conversion Path
  // 转化路径
  conversionPath=(path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
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
 
handleMenuClick = ({ key }) => {
  switch (key) {
    case 'logout':
      this.props.dispatch({
        type: 'login/logout',
      });
      break;
    case 'changepwd':
      this._changepwd.wrappedInstance.refs.wrappedComponent.showwindow(true);
      break;
    default:
      break;
  }  
}
handleNoticeVisibleChange = (visible) => {
  this.Popover.close(visible);
  if (visible) {
    this.props.dispatch({
      type: 'global/fetchNotices',
      payload:{}
    });
  }
}
onSearch=(value)=>{ 
   
}

onPressEnter=(value)=>{ 
   
}
onChange=(value)=>{
  let _this=this;
  this.setState({
    oldvalue:value
   })
  setTimeout(function () {
    if(_this.state.oldvalue==value)
    {
      _this.props.dispatch({
        type: 'search/queryLxSearchResult',
        payload:{
          value:value
        }
      });
    }
  }, 1000);
}
modifymsgDetailStateData=(DGIMN,datenow)=>{
  // console.log(this._MessageDetail);
  this._MessageDetail.modifyMessageDetailStateData(DGIMN,datenow);
}
transfershowdetail=(showdetail)=>{
  this.setState(showdetail);
}
render() {
  const {
    currentUser, fetchingNotices,
    location: { pathname },
  } = this.props;


  const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
  const SCREEN_WIDTH = document.querySelector('body').offsetWidth;

  const { openKeys } = this.state;
  const menu = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={(param)=>{
      this.handleMenuClick(param);
    }}>
      <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
      <Menu.Item key="changepwd"><Icon type="edit" />修改密码</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
    </Menu>
  );
  const noticeData = this.getNoticeData();  
  let selectedKeys = this.getSelectedMenuKeys(pathname);
  if (!selectedKeys.length) {
    selectedKeys = [openKeys[openKeys.length - 1]];
  }
  return (
    <Header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="logo"  />
        <h1>{config.name}</h1>
      </div>
      <div className={styles.right}>
        <HeaderSearch
          placeholder="站内搜索"
          dataSource={this.props.lxsearchinfo}
          className={`${styles.action} ${styles.search}`}
          onSearch={ this.onSearch }
          onChange={this.onChange }
          onPressEnter={this.onPressEnter}
          />
        <NoticeIcon
          className={styles.action}
          count={currentUser.notifyCount}
          onItemClick={(item, tabProps) => {
            this.Popover.close(false);
            this.setState({
              showdetail: true,
              detailtitle: item.parentname + "-" + item.pointname,
              DGIMN: item.DGIMN,
              datetime: item.datetime,
              datenow: item.datenow
            });
            this.modifymsgDetailStateData(item.DGIMN,item.datenow);
            // console.log(item, tabProps); // eslint-disable-line
          }}          
          onPopupVisibleChange={this.handleNoticeVisibleChange}
          loading={fetchingNotices}
          popupAlign={{ offset: [20, -16] }}
          ref={(ref) => { this.Popover = ref; }}
          >
          <NoticeIcon.Tab
            list={noticeData['报警']}
            title="报警"
            isshowclear={false}
            emptyText="你已查看所有通知"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['消息']}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
        </NoticeIcon>
        {currentUser.User_Name ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                {currentUser.User_Name}
              </span>
          </Dropdown>
            ) : <Spin size="small" style={{ marginLeft: 8 }} />}
      </div>
      <Menu
        mode="horizontal"
        onOpenChange={this.handleOpenChange}
        selectedKeys={selectedKeys}
        style={{ padding: '12px 0', height: '64px' }}
        >
        {this.getNavMenuItems(this.menus)}
      </Menu>

      

      <MessageDetail {...this.state} ref={(ref) => {this._MessageDetail = ref;}} transfershowdetail = {msg => this.transfershowdetail(msg)} />    

      <ChangePwdDetail  ref={(ref) => { this._changepwd = ref; }}  />
    
    </Header>
  );
}
}


const menuData = [
  {
    layout: 'MonitorLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '监测数据列表',
        path: 'list',
        icon: 'bars',
      },
      {
        name: '监测数据地图',
        path: 'map',
        icon: 'environment-o',
      },
      {
        name: '地图测试',
        path: 'maptest',
        icon: 'environment-o',
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '忘记密码',
        path: 'register-result',
      },
    ],
  },
  {
    name: '使用文档',
    icon: 'book',
    path: 'http://pro.ant.design/docs/getting-started',
    target: '_blank',
  },
];

function formatter(data, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}

export const getMenuData = () => formatter(menuData[0].children);

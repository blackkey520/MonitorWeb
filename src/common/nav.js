import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavDataa = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/MonitorLayout')),
    layout: 'MonitorLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '监测数据列表',
        path: 'list',
        icon: 'bars',
        component: dynamicWrapper(app, ['monitor', 'login'], () => import('../routes/MonitorDataList')),
      },
      {
        name: '监测数据地图',
        path: 'map',
        icon: 'environment-o',
        component: dynamicWrapper(app, [], () => import('../routes/MonitorDataMap')),
      },
      {
        name: '地图测试',
        path: 'maptest',
        icon: 'environment-o',
        component: dynamicWrapper(app, [], () => import('../routes/AMapTest')),
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/UserLogin')),
          },
          {
            name: '忘记密码',
            path: 'register-result',
            component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
    layout: 'BlankLayout',
    children: {
      name: '使用文档',
      path: 'http://pro.ant.design/docs/getting-started',
      target: '_blank',
      icon: 'book',
    },
  },
];

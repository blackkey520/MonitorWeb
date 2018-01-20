import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const routerData = getRouterData(app);
    return component().then((raw) => {
      const Component = raw.default || raw;
      return props => <Component {...props} routerData={routerData} />;
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/MonitorLayout')),
    },
    '/list': {
      component: dynamicWrapper(app, ['monitor', 'login'], () => import('../routes/MonitorDataList')),
    },
    '/list/monitordetail': {
      component: dynamicWrapper(app, [], () => import('../routes/MonitorDetail')),
    },
    '/list/monitordetail/realtimedata': {
      component: dynamicWrapper(app, [], () => import('../routes/MonitorDetail/RealTimeData')),
    },
    '/list/monitordetail/minutedata': {
      component: dynamicWrapper(app, [], () => import('../routes/MonitorDetail/MinuteData')),
    },
    '/list/monitordetail/hourdata': {
      component: dynamicWrapper(app, [], () => import('../routes/MonitorDetail/HourData')),
    },
    '/list/monitordetail/daydata': {
      component: dynamicWrapper(app, [], () => import('../routes/MonitorDetail/DayData')),
    },
    '/map': {
      component: dynamicWrapper(app, ['points'], () => import('../routes/MonitorDataMap')),
    },
    '/maptest': {
      component: dynamicWrapper(app, [], () => import('../routes/AMapTest')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/UserLogin')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};

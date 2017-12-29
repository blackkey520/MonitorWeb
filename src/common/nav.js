import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
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
        children: [
          {
            name: '基础表单',
            path: 'basic-form',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
          },
          {
            name: '分步表单',
            path: 'step-form',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
            children: [
              {
                path: 'confirm',
                component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
              },
              {
                path: 'result',
                component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
              },
            ],
          },
          {
            name: '高级表单',
            path: 'advanced-form',
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
          },
        ],
      },
      {
        name: '监测数据地图',
        path: 'map',
        icon: 'environment-o',
        children: [
          {
            name: '查询表格',
            path: 'table-list',
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
          },
          {
            name: '标准列表',
            path: 'basic-list',
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
          },
          {
            name: '卡片列表',
            path: 'card-list',
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
          },
          {
            name: '搜索列表',
            path: 'search',
            component: dynamicWrapper(app, [], () => import('../routes/List/List')),
            children: [{
              name: '搜索列表（项目）',
              path: 'projects',
              component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
            }, {
              name: '搜索列表（应用）',
              path: 'applications',
              component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
            }, {
              name: '搜索列表（文章）',
              path: 'articles',
              component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
            }],
          },
        ],
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

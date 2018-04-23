import { isUrl } from '../utils/utils';

const menuData = [
  {
    layout: 'MonitorLayout',
    name: '首页', // for breadcrumb
    path: 'monitor',
    children: [
      {
        name: '数据列表',
        path: 'list',
        icon: 'bars',
        children:[
          {
            name: '监测数据列表',
            path: 'mlist',
            icon: 'bars',
          },
          {
          name: '报警数据列表',
          path: 'alarm',
          icon: 'bars',
        }]
      },
      {
        name: '监测数据地图',
        path: 'map',
        icon: 'environment-o',
      } ,
      {
        name: '全文搜索',
        path: 'search',
        icon: 'bars',
      } 
    ],
  }
];

function formatter(data, parentPath = '') {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);

export const getMenuArray = () => getMenuArrays(formatter(menuData));

function getMenuArrays(data) {
  let res=[];
  var aa= data.map((item) => {
    if (item) {
      res.push(item);
      if (item.children) {
        getMenuArrays(item.children).map(a => {
          if (a) {
            res.push(a);
          }
        });
      } else {
        return null;
      }
    }
    return res;
  });
  return res;
}

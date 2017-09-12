const { config } = require('./common')

const { apiPrefix } = config
let database = [
  {
    id: '1',
    icon: 'laptop',
    name: '监控面板',
    route: '/dashboard',
  },
  {
    id: '2',
    bpid: '1',
    name: '数据一览',
    icon: 'layout',
    route: '/generalview',
  },
  {
    id: '7',
    bpid: '1',
    name: '监控地图',
    icon: 'environment',
    route: '/map',
  },
  {
    id: '4',
    bpid: '1',
    name: '监控预警',
    icon: 'notification',
  },
  {
    id: '41',
    bpid: '4',
    mpid: '4',
    name: '预警核实',
    icon: 'edit',
    route: '/Alarm/alarmcheck',
  },
  {
    id: '42',
    bpid: '4',
    mpid: '4',
    name: '预警历史',
    icon: 'database',
    route: '/Alarm/alarmhistory',
  },
  {
    id: '43',
    bpid: '4',
    mpid: '4',
    name: '反馈记录',
    icon: 'bars',
    route: '/Alarm/feedbackhistory',
  },
  {
    id: '5',
    bpid: '1',
    name: '统计分析',
    icon: 'pie-chart',
  },
  {
    id: '51',
    bpid: '5',
    mpid: '5',
    name: '同比分析',
    icon: 'line-chart',
    route: '/Analytics/tongbi',
  },
  {
    id: '52',
    bpid: '5',
    mpid: '5',
    name: '环比分析',
    icon: 'bar-chart',
    route: '/Analytics/huanbi',
  },
  {
    id: '53',
    bpid: '5',
    mpid: '5',
    name: '预警统计',
    icon: 'area-chart',
    route: '/Analytics/alarmstatic',
  }
]

module.exports = {

  [`GET ${apiPrefix}/menus`] (req, res) {
    res.status(200).json(database)
  },
}

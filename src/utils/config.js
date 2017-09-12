const APIV1 = '/api'
const APIMOCK='/mock'
module.exports = {
  name: '环境监控平台',
  prefix: 'monitorOnline',
  footerText: '环境监控平台  © 2017 lee',
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  openPages: ['/login'],
  apiPrefix: '/mock',
  APIV1,
  APIMOCK,
  api: {
    userLogin: `${APIV1}/rest/Author/IsLogins/`,
    menus: `${APIMOCK}/menus`
  },
}

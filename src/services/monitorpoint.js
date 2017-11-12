import { request, config } from 'utils'

const { api } = config
const { monitorpoint } = api
import Cookie from 'js-cookie'

export async function loadmonitorpoint (params) {
  const usr = JSON.parse(Cookie.get('token'))
  let body = {
    authorCode: usr.User_ID,
    pollutantType: params.pollutantType,
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
  }
  return request({ url: monitorpoint, method: 'get', data: body })
}

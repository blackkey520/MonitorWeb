import { request, config } from 'utils'

const { api } = config
const { realtimeOverView, minuteOverView, hourOverView, dayOverView, pollutant } = api
import Cookie from 'js-cookie'

export async function loadmonitoroverview (params) {
  const usr = JSON.parse(Cookie.get('token'))
  let body = {
    authorCode: usr.User_ID,
    pollutantType: params.pollutantType,
    searchTime: params.searchTime,
  }
  if (params.monitortype === 'realtime') {
    return request({ url: realtimeOverView, method: 'get', data: body })
  } else if (params.monitortype === 'minute') {
    return request({ url: minuteOverView, method: 'get', data: body })
  } else if (params.monitortype === 'hour') {
    return request({ url: hourOverView, method: 'get', data: body })
  } else if (params.monitortype === 'day') {
    return request({ url: dayOverView, method: 'get', data: body })
  }
}
export async function loadpollutant (params) {
  const usr = JSON.parse(Cookie.get('token'))
  let body = {
    authorCode: usr.User_ID,
    pollutantType: params.pollutantType,
  }
  return request({ url: pollutant, method: 'get', data: body })
}

import { request, config } from 'utils'
import Cookie from 'js-cookie'

const { api } = config
const { pollutanttype } = api


export async function loadpollutanttype () {
  const usr = JSON.parse(Cookie.get('token'))
  let body = {
    authorCode: usr.User_ID,
  }
  return request({ url: pollutanttype, method: 'get', data: body })
}

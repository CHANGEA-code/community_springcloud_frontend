import request from '@/utils/request'

export function getTodayTip() {
  return request({
    url: '/blog/tip/today',
    method: 'get'
  })
}
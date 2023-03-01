import request from '@/utils/request'
export function getById(userId) {
  return request({
    url: '/user/get/'+userId,
    method: 'get' 
  })
}
// 更新
export function update(user) {
  return request({
    url: '/user/update',
    method: 'put',
    data: user
  })
}
export function updatePass(userId, oldPass, newPass) {
  return request({
    url: '/user/update-pass/' + userId,
    method: 'put',
    data: {
      oldPass,
      newPass
    }
  })
}




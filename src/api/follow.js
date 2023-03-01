import request from '@/utils/request'

// 关注
export function follow(userId,authorId) {
  return request(({
    url: `/blog/follow/add/${userId}/${authorId}`,
    method: 'post'
  }))
}

// 取消关注
export function unFollow(userId,authorId) {
  return request(({
    url: `/blog/follow/delete/${userId}/${authorId}`,
    method: 'delete'
  }))
}

//检查是否关注
export function isFollow(userId,authorId) {
  return request(({
    url: `/blog/follow/isfollow/${userId}/${authorId}`,
    method: 'get'
  }))
}
//我的关注
export function getFollowed(userId) {
  return request(({
    url: `/blog/follow/get-followed/${userId}`,
    method: 'get'
  }))
}
//我的粉丝
export function getFans(userId) {
  return request(({
    url: `/blog/follow/get-follower/${userId}`,
    method: 'get'
  }))
}

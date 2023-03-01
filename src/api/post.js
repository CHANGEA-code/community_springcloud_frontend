import request from '@/utils/request'

// 列表
export function getList(pageNo, size, tab) {
    return request(({
        url: '/blog/post/page',
        method: 'get',
        params: { 
            tab: tab,
            pageNum: pageNo,
            pageSize: size
        }
    }))
}

export function pageByUserId(userId, current, size) {
    return request({
        url: `/blog/post/page-by-userid/${userId}`,
        method: 'get',
        params: { 
            pageNum: current,
            pageSize: size, 
        }
    })
}

// 获取详情页推荐
export function getRecommendTopics(id, size, tagId) {
    return request({
        url: `/blog/post/recommend`,
        method: 'get',
        params: {
            id,
            pageSize:size,
            tagId:tagId
        }
    })
}
// 浏览
export function getTopic(id) {
    return request({
        url: `/blog/post/get/${id}`,
        method: 'get'
    })
}

// 发布
export function post(topic) {
    return request({
        url: '/blog/post/save',
        method: 'post',
        data: topic
    })
}

export function deleteTopic(id) {
    return request({
        url: `/blog/post/remove/${id}`,
        method: 'delete'
    })
}
export function update(topic) {
    return request({
        url: '/blog/post/update',
        method: 'put',
        data: topic
    })
}

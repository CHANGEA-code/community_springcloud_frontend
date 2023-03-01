import request from '@/utils/request'

// 关键词检索
export function searchByKeyword(query) {
    return request({
        url: '/blog/post/search',
        method: 'get',
        params: {
            title: query.keyword,
            pageNum: query.pageNum,
            pageSize: query.pageSize
        }
    })
}
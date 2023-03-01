import request from '@/utils/request'

export function fetchCommentsByTopicId(topic_Id) {
    return request({
        url: '/blog/comment/get_first_layer_comment',
        method: 'get',
        params: {
            topicId: topic_Id
        }
    })
}

export function pushComment(data) {
    return request({
        url: '/blog/comment/add',
        method: 'post',
        data: data
    })
}

export function getCommentByCommentId(commentId) {
    return request({
        url: '/blog/comment/get_comment_by_commentid',
        method: 'get',
        params: {
            commentId: commentId
        }
    })
}

export function deleteComment(commentId) {
    return request({
        url: '/blog/comment/' + commentId,
        method: 'delete',
    })
}
import request from '@/utils/request'

const api_name = '/admin/article'
// 分页列表
export const GetArticleArticleListByPage = (page, limit, queryDto) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}

//单个删除
export const DeleteArticleById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete'
  })
}
//批量删除
export const DeleteArticleBatchIds = ids => {
  return request({
    url: `${api_name}/deleteBatchIds`,
    method: 'delete',
    data: ids
  })
}

//添加
export const SaveArticle = Article => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: Article
  })
}
//修改
export const updateArticle = Article => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: Article
  })
}
//审批-通过
export const ApprovePass = id => {
  return request({
    url: `${api_name}/approvePass/${id}`,
    method: 'put'
  })
}
//驳回新闻(id和reason)
export const ApproveReject = reason => {
  return request({
    url: `${api_name}/approveReject`,
    method: 'put',
    data: reason
  })
}

//新闻发布
export const PublishArticle = id => {
  return request({
    url: `${api_name}/publish/${id}`,
    method: 'put'
  })
}

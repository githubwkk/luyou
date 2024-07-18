import request from '@/utils/request'
//文章类型
const api_name = '/admin/articleType'
//列表
export const GetArticleTypeList = () => {
  return request({
    url: `${api_name}/list`,
    method: 'get'
  })
}
// 分页列表
export const GetArticleTypeListByPage = (page, limit) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get'
  })
}

//单个删除
export const DeleteArticleTypeById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete'
  })
}
//批量删除
export const DeleteArticleTypeBatchIds = ids => {
  return request({
    url: `${api_name}/deleteBatchIds`,
    method: 'delete',
    data: ids
  })
}

//添加
export const SaveArticleType = ArticleType => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: ArticleType
  })
}
//修改
export const updateArticleType = ArticleType => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: ArticleType
  })
}
//禁用
export const disableStatus = id => {
  return request({
    url: `${api_name}/disableStatus/${id}`,
    method: 'put'
  })
}
//启用
export const enableStatus = id => {
  return request({
    url: `${api_name}/enableStatus/${id}`,
    method: 'put'
  })
}

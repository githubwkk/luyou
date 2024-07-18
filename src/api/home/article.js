import request from '@/utils/request'

const api_name = '/api/article'
//获取发布的列表
export const GetList = searchDto => {
  return request({
    url: `${api_name}/getArticleList`,
    method: 'post',
    data: searchDto
  })
}
export const GetOne = id => {
  return request({
    url: `${api_name}/getOne/${id}`,
    method: 'get'
  })
}
//点赞
export const Like = id => {
  return request({
    url: `${api_name}/like/${id}`,
    method: 'put'
  })
}
//浏览
export const View = id => {
  return request({
    url: `${api_name}/view/${id}`,
    method: 'put'
  })
}

//获取个人文章
export const GetPersonalArticle = (page, limit, uid) => {
  return request({
    url: `${api_name}/getPersonalArticle/${page}/${limit}/${uid}`,
    method: 'get'
  })
}

//发布（审核后）个人文章
export const PublishPersonalArticle = id => {
  return request({
    url: `${api_name}/publish/${id}`,
    method: 'put'
  })
}

//删除文章
export const DeleteArticle = id => {
  return request({
    url: `${api_name}/delete/${id}`,
    method: 'delete'
  })
}

//获取提到的景点的信息
export const GetTourist = tid => {
  return request({
    url: `${api_name}/getTourist/${tid}`,
    method: 'get'
  })
}

//搜索文章
export const SearchArticle = (keyword) => {
  return request({
    url: `${api_name}/search/${keyword}`,
    method: 'get'
  })
}

import request from '@/utils/request'

const api_name = '/admin/ta'
// 分页列表
export const GetTAListByPage = (page, limit, queryDto) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}
//id、nameList
export const getTAIdNameList = () => {
  return request({
    url: `${api_name}/list`,
    method: 'get'
  })
}

//id、nameList通过地区
export const GetTAIdNameListByRegion = region => {
  return request({
    url: `${api_name}/listByRegion`,
    method: 'get',
    params: region
  })
}
//单个删除
export const DeleteTAById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete'
  })
}
//批量删除
export const DeleteTABatchIds = ids => {
  return request({
    url: `${api_name}/deleteBatchIds`,
    method: 'delete',
    data: ids
  })
}

//添加
export const SaveTA = TA => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: TA
  })
}
//修改
export const updateTA = TA => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: TA
  })
}

import request from '@/utils/request'

const api_name = '/admin/tatype'
// 查询所有的旅游景点类型
export const GetAllTAT = () => {
  return request({
    url: `${api_name}/list`,
    method: 'get'
  })
}

// 分页列表
export const GetTATPageList = (page, limit) => {
  return request({
    url: `${api_name}/pageList/${page}/${limit}`,
    method: 'get'
  })
}

// 保存旅游景点类型
export const SaveTAT = tat => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: tat
  })
}

// 修改旅游景点类型
export const UpdateTATById = tat => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: tat
  })
}

// 根据id删除旅游景点类型
export const DeleteTATById = id => {
  return request({
    url: `${api_name}/deleteById/${id}`,
    method: 'delete'
  })
}

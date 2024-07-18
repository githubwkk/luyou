import hotel from '@/router/adminModules/hotel.js'
import request from '@/utils/request'

const api_name = '/admin/room'

// 分页列表
export const GetRoomListByPage = (page, limit, queryDto) => {
  return request({
    url: `${api_name}/list/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}

//添加
export const SaveRoom = room => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: room
  })
}

//修改
export const UpdateRoom = room => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: room
  })
}

//删除
export const DeleteRoomById = id => {
  return request({
    url: `${api_name}/deleteRoomById/${id}`,
    method: 'delete'
  })
}

//批量删除
export const DeleteRoomBatchIds = ids => {
  return request({
    url: `${api_name}/deleteRoomBatchIds`,
    method: 'delete',
    data: ids
  })
}

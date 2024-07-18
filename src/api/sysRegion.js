import request from '@/utils/request'

export const GetRegion = () => {
  return request({
    url: '/admin/system/sysregion/findNodes',
    method: 'get'
  })
}
// 根据parentId获取下级节点
export const findRegionList = parentId => {
  return request({
    url: `/admin/system/sysregion/findRegionList/${parentId}`,
    method: 'get'
  })
}

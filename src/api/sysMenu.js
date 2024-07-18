import request from '@/utils/request'

const api_name = '/admin/system/sysMenu'
// 用户获取菜单
export const GetMenus = params => {
  return request({
    url: '/admin/system/index/menus',
    method: 'get',
    params
  })
}

// 分页列表
export const FindNodes = () => {
  return request({
    url: `${api_name}/findNodes`,
    method: 'get'
  })
}

// 保存信息
export const SaveMenu = sysMenu => {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: sysMenu
  })
}

// 修改信息
export const UpdateSysMenuById = sysMenu => {
  return request({
    url: `${api_name}/updateById`,
    method: 'put',
    data: sysMenu
  })
}

// 根据id删除数据
export const RemoveSysMenuById = id => {
  return request({
    url: `${api_name}/removeById/${id}`,
    method: 'delete'
  })
}

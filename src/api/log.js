import request from '@/utils/request'

export const GetLogList = (page, limit, queryDto) => {
  return request({
    url: `/admin/log/pageList/${page}/${limit}`,
    method: 'get',
    params: queryDto
  })
}

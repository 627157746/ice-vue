import request from '@/utils/request'

export function deptTree() {
  return request({
    url: '/system/depts/tree',
    method: 'get'
  })
}

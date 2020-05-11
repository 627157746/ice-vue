import request from '@/utils/request'

export function getMenusByCurrentUser() {
  return request({
    url: '/system/menus',
    method: 'get'
  })
}

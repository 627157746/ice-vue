import request from '@/utils/request'

export function getMenusByCurrentUser() {
  return request({
    url: '/system/menus',
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: '/system/menus/tree',
    method: 'get'
  })
}

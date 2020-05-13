import request from '@/utils/request'

export function getMenusByCurrentUser() {
  return request({
    url: '/system/menus',
    method: 'get'
  })
}

export function getMenuTree(isAll) {
  return request({
    url: '/system/menus/tree',
    method: 'get',
    params: { 'isAll': isAll }
  })
}

export function add(menu) {
  return request({
    url: `/system/menus`,
    method: 'post',
    data: menu
  })
}

export function update(menu) {
  return request({
    url: `/system/menus`,
    method: 'put',
    data: menu
  })
}

export function getById(id) {
  return request({
    url: `/system/menus/${id}`,
    method: 'get'
  })
}

export function delById(id) {
  return request({
    url: `/system/menus/${id}`,
    method: 'delete'
  })
}

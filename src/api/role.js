import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/system/roles',
    method: 'get'
  })
}

export function pageByQuery(query) {
  return request({
    url: '/system/roles/page',
    method: 'get',
    params: query
  })
}

export function getById(id) {
  return request({
    url: `/system/roles/${id}`,
    method: 'get'
  })
}

export function getMenuIdsById(id) {
  return request({
    url: `/system/roles/menus/${id}`,
    method: 'get'
  })
}

export function add(role) {
  return request({
    url: `/system/roles`,
    method: 'post',
    data: role
  })
}

export function update(role) {
  return request({
    url: `/system/roles`,
    method: 'put',
    data: role
  })
}

export function updateRoleMenuById(id, menuIds) {
  return request({
    url: `/system/roles/${id}`,
    method: 'put',
    data: menuIds
  })
}

export function delById(id) {
  return request({
    url: `/system/roles/${id}`,
    method: 'delete'
  })
}

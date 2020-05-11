import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    headers: { 'Authorization': 'Basic YWRtaW46MTIzNDU2' },
    params: data
  })
}
export function logout(token) {
  return request({
    url: '/auth/oauth/logout',
    method: 'get',
    params: token
  })
}

export function pageByQuery(query) {
  return request({
    url: '/system/users',
    method: 'get',
    params: query
  })
}

export function getById(id) {
  return request({
    url: `/system/users/${id}`,
    method: 'get'
  })
}

export function add(user) {
  return request({
    url: `/system/users`,
    method: 'post',
    data: user
  })
}

export function update(user) {
  return request({
    url: `/system/users`,
    method: 'put',
    data: user
  })
}

export function delById(id) {
  return request({
    url: `/system/users/${id}`,
    method: 'delete'
  })
}

export function delByIds(ids) {
  return request({
    url: `/system/users/batch/delete`,
    method: 'post',
    data: ids
  })
}

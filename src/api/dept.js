import request from '@/utils/request'

export function deptTree(id) {
  return request({
    url: '/system/depts/tree',
    method: 'get',
    params: { id: id }
  })
}

export function getById(id) {
  return request({
    url: `/system/depts/${id}`,
    method: 'get'
  })
}

export function add(dept) {
  return request({
    url: `/system/depts`,
    method: 'post',
    data: dept
  })
}

export function update(dept) {
  return request({
    url: `/system/depts`,
    method: 'put',
    data: dept
  })
}

export function delById(id) {
  return request({
    url: `/system/depts/${id}`,
    method: 'delete'
  })
}

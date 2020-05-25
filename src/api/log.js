import request from '@/utils/request'

export function pageByQuery(query) {
  return request({
    url: '/system/logs',
    method: 'get',
    params: query
  })
}

export function getById(id) {
  return request({
    url: `/system/logs/${id}`,
    method: 'get'
  })
}

export function delById(id) {
  return request({
    url: `/system/logs/${id}`,
    method: 'delete'
  })
}

export function delByIds(ids) {
  return request({
    url: `/system/logs/batch/delete`,
    method: 'post',
    data: ids
  })
}

import request from '@/utils/request'

export function pageDictsByQuery(query) {
  return request({
    url: '/system/dicts',
    method: 'get',
    params: query
  })
}

export function getDictById(id) {
  return request({
    url: `/system/dicts/${id}`,
    method: 'get'
  })
}

export function addDict(dict) {
  return request({
    url: `/system/dicts`,
    method: 'post',
    data: dict
  })
}

export function updateDict(dict) {
  return request({
    url: `/system/dicts`,
    method: 'put',
    data: dict
  })
}

export function delDictById(id) {
  return request({
    url: `/system/dicts/${id}`,
    method: 'delete'
  })
}

export function getDictItemsByType(type) {
  return request({
    url: `/system/dicts/items/type/${type}`,
    method: 'get'
  })
}

export function pageDictItemsByQuery(query) {
  return request({
    url: '/system/dicts/items',
    method: 'get',
    params: query
  })
}

export function getDictItemById(id) {
  return request({
    url: `/system/dicts/items/${id}`,
    method: 'get'
  })
}

export function addDictItem(dictItem) {
  return request({
    url: `/system/dicts/items`,
    method: 'post',
    data: dictItem
  })
}

export function updateDictItem(dictItem) {
  return request({
    url: `/system/dicts/items`,
    method: 'put',
    data: dictItem
  })
}

export function delDictItemById(id) {
  return request({
    url: `/system/dicts/items/${id}`,
    method: 'delete'
  })
}

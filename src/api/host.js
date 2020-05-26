import request from '@/utils/request'

export function getHostInfo() {
  return request({
    url: '/system/hosts',
    method: 'get'
  })
}


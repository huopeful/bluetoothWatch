import request from '@/utils/request'
// 注册区域
export function logicarea(data) {
  return request({
    url: '/prison/map/logicarea',
    method: 'post',
    data
  })
}
// 删除楼层地图区域
export function clearArea(data) {
  return request({
    url: '/prison/map/clearArea',
    method: 'post',
    params: data
  })
}
// 楼层包含的所有的小监区组成信息
export function logiclist(data) {
  return request({
    url: '/prison/map/logiclist',
    method: 'post',
    params: data
  })
}
// 设置阈值
export function setupThreshold(data) {
  return request({
    url: '/prison/exception/setup',
    method: 'post',
    data
  })
}
// 当前阈值信息显示
export function showThreshold(data) {
  return request({
    url: '/prison/exception/showThreshold',
    method: 'post',
    data
  })
}

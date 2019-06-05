import request from '@/utils/request'
//健康列表
export function getHealthList(data) {
  return request({
    url: '/prison/health/list',
    method: 'post',
    data
  })
}
//健康详情（心率血压图）
export function getHealthDetail(data) {
  return request({
    url: '/prison/health/detail',
    method: 'post',
    data
  })
}
//创建犯人信息（健康监控）
export function prisonerRegister(data) {
  return request({
    url: '/prison/prisoner/register',
    method: 'post',
    data
  })
}
//健康电池等报警
export function alarm(data) {
  return request({
    url: '/prison/exception/alarm',
    method: 'post',
    params: data
  })
}
//健康电池等报警
export function handleAlarm(data) {
  return request({
    url: '/prison/exception/handle',
    method: 'post',
    data
  })
}


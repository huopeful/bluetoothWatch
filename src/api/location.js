import request from '@/utils/request'

// 获取最新的定位 请求参数 楼层id (目前没有分监区)
export function getLocation(data) {
  return request({
    url: '/prison/map/currentPt',
    method: 'post',
    params: data
  })
}
// 获取人员轨迹信息
export function getTrajectory(data) {
  return request({
    url: '/prison/map/review',
    method: 'post',
    params: data
  })
}

// 获取被点击的人员姓名,心率,血压
export function getInfo(data) {
  return request({
    url: '/prison/health/lastDetail',
    method: 'post',
    params: data
  })
}

// 获取轨迹时间列表
export function getTrajectoryDateList() {
  return request({
    url: '/prison/shard/date',
    method: 'post'
  })
}

import request from '@/utils/request'
//绑定设备的人员列表
export function getBindDeviceList(data) {
  return request({
    url: '/prison/prisoner/list',
    method: 'post',
    params: data
  })
}
//人员解绑设备
export function unbindBeacon(data) {
    return request({
      url: '/prison/prisoner/unbindBeacon',
      method: 'post',
      params: data
    })
  }
  //设备列表
export function deviceList(data) {
    return request({
      url: '/prison/device/list',
      method: 'post',
      params: data
    })
  }

 //设备注册
 export function deviceRegister(data) {
    return request({
      url: '/prison/device/register',
      method: 'post',
      data
    })
  }
  //人员绑定设备
export function bindBeacon(data) {
    return request({
      url: '/prison/prisoner/bindBeacon',
      method: 'post',
      params: data
    })
  }
  /*  //获取未被绑定的设备信息
export function unbindBeaconMessage(data) {
  return request({
    url: '/prison/prisoner/bindBeacon',
    method: 'post',
    params: data
  })
} */


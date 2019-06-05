import Mock from 'mockjs'

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft', 'deleted'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform'],
    'name|1': ['张三', '李四', '王五', '赵本山', '菜虚困', '周润发', '范冰冰', '李冰冰', '鹿晗', 'TFBOYS1', 'TFBOYS2', 'TFBOYS3', '汤明灰'],
    'sex|1': ['男', '女'],
    'IDNum|100000000000000000-999999999999999999': 1,
    'deviceNumber|10000-999999': 1,
    'phoneNumber|10000000000-99999999999': 1,
    date: +Mock.Random.date('T'),
    address: '@county(true)',
    reason: '@cparagraph(2, 4)',
    'heartRate|60-100': 1,
    'bloodPressure|90-140': 1,
    'houseId|10000-999999': 1,
    'minHeartRate|60-100': 1,
    'minBloodRate|90-140': 1,
    'maxHeartRate|60-100': 1,
    'maxBloodRate|90-140': 1,
    'averageH|60-100': 1,
    'averageB|90-140': 1,
    'healthStatusText|1': ['健康', '不健康'],
    'currentHeartRate|60-100': 1,
    'currentBloodRate|90-140': 1,
    'accusation|1': ['抢劫', '偷盗'],
    'areaCode|1-9': 1,
    'roomNumber|1-1000': 1,
    'remark|1': ['备注1', '备注2'],
    'isKeyCriminals|1': ['是', '不是'],
  }))
}

export default [
  {
    url: '/article/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]


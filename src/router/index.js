import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    // 重定向
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    // 辅助重定向
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'realTimeMonitor'
    // meta: {
    //   title: 'deviceManagement',
    //   icon: 'example'
    // },
    // children: [
    //   // {
    //   //   path: 'dashboard',
    //   //   component: () => import('@/views/dashboard/prisonArea1/index'),
    //   //   name: 'Dashboard',
    //   //   //  affix  选项  是否固定在导航栏 noCache: true  不会被 <keep-alive> 缓存
    //   //   meta: { title: 'menu1-1', icon: 'monitor', noCache: true, affix: true }
    //   // },
    //   {
    //     path: 'dashboard',
    //     component: () => import('@/views/dashboard/prisonArea1'),
    //     name: 'PrisonArea1',
    //     //  affix  选项  是否固定在导航栏 noCache: true  不会被 <keep-alive> 缓存
    //     meta: { title: 'dashboardList.prisonArea1', icon: 'monitor', noCache: true, affix: true },
    //     children: [
    //       {
    //         path: '3DMap',
    //         component: () => import('@/views/dashboard/prisonArea1/3DMap'),
    //         name: 'Menu1-1',
    //         meta: { title: '3DMap' }
    //       },
    //       {
    //         path: 'menu1-2',
    //         component: () => import('@/views/dashboard/prisonArea1/menu1-2'),
    //         name: 'Menu1-2',
    //         redirect: '/dashboard/prisonArea1/menu1-2/menu1-2-1',
    //         meta: { title: 'menu1-2' },
    //         children: [
    //           {
    //             path: 'menu1-2-1',
    //             component: () => import('@/views/dashboard/prisonArea1/menu1-2/menu1-2-1'),
    //             name: 'Menu1-2-1',
    //             meta: { title: 'menu1-2-1' }
    //           },
    //           {
    //             path: 'menu1-2-2',
    //             component: () => import('@/views/dashboard/prisonArea1/menu1-2/menu1-2-2'),
    //             name: 'Menu1-2-2',
    //             meta: { title: 'menu1-2-2' }
    //           }
    //         ]
    //       },
    //       {
    //         path: 'menu1-3',
    //         component: () => import('@/views/dashboard/prisonArea1/menu1-3'),
    //         name: 'Menu1-3',
    //         meta: { title: 'menu1-3' }
    //       }
    //     ]
    //   },
    // ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 * 根据用户选择动态的加载路由
 */
export const asyncRoutes = [
  {
    path: '/realTimeMonitor',
    component: Layout,
    redirect: '/realTimeMonitor/3DMap/prisonArea1',
    name: 'Nested',
    meta: {
      title: 'realTimeMonitor',
      icon: 'jianguan',
      noCache: true
    },
    //     //  affix  选项  是否固定在导航栏 noCache: true  不会被 <keep-alive> 缓存
    //     meta: { title: 'dashboardList.prisonArea1', icon: 'monitor', noCache: true, affix: true },
    children: [
      {
        path: '3DMap',
        component: () => import('@/views/realTimeMonitor/3DMap/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'realTimeMonitorList.3DMap' },
        redirect: '/realTimeMonitor/3DMap/prisonArea1',
        children: [
          {
            path: 'prisonArea1',
            component: () => import('@/views/realTimeMonitor/3DMap/prisonArea1'),
            name: 'PrisonArea1',
            meta: { noCache: true, title: 'realTimeMonitorList.mapList.prisonArea1' }
          },
          {
            path: 'prisonArea1/:id',
            component: () => import('@/views/realTimeMonitor/3DMap/prisonArea1/path'),
            name: 'realTimeMonitorList.mapList.path',
            meta: { noCache: true, title: 'realTimeMonitorList.mapList.path', activeMenu: '/realTimeMonitor/3DMap/prisonArea1' },
            hidden: true
          },
          {
            path: 'prisonArea2',
            component: () => import('@/views/realTimeMonitor/3DMap/prisonArea2'),
            name: 'realTimeMonitorList.mapList.prisonArea2',
            meta: { noCache: true, title: 'realTimeMonitorList.mapList.prisonArea2' }
          },
          {
            path: 'prisonArea2/:id',
            component: () => import('@/views/realTimeMonitor/3DMap/prisonArea2/path'),
            name: 'realTimeMonitorList.mapList.path',
            meta: { noCache: true, title: 'realTimeMonitorList.mapList.path', activeMenu: '/realTimeMonitor/3DMap/prisonArea2' },
            hidden: true
          },
          {
            path: 'prisonArea3',
            component: () => import('@/views/realTimeMonitor/3DMap/prisonArea3'),
            name: 'realTimeMonitorList.mapList.prisonArea3',
            meta: { noCache: true, title: 'realTimeMonitorList.mapList.prisonArea3' }
          },
          {
            path: 'prisonArea3/:id',
            component: () => import('@/views/realTimeMonitor/3DMap/prisonArea3/path'),
            name: 'realTimeMonitorList.mapList.path',
            meta: { noCache: true, title: 'realTimeMonitorList.mapList.path', activeMenu: '/realTimeMonitor/3DMap/prisonArea3' },
            hidden: true
          },
          {
            path: 'prisonArea4',
            component: () => import('@/views/realTimeMonitor/3DMap/prisonArea4'),
            name: 'realTimeMonitorList.mapList.prisonArea4',
            meta: { noCache: true, title: 'realTimeMonitorList.mapList.prisonArea4' }
          },
          {
            path: 'prisonArea4/:id',
            component: () => import('@/views/realTimeMonitor/3DMap/prisonArea4/path'),
            name: 'realTimeMonitorList.mapList.path',
            meta: { noCache: true, title: 'realTimeMonitorList.mapList.path', activeMenu: '/realTimeMonitor/3DMap/prisonArea4' },
            hidden: true
          }
        ]
      },
      // {
      //   path: 'enclosure',
      //   component: () => import('@/views/realTimeMonitor/enclosure/index'), // Parent router-view
      //   // name: 'Menu1',
      //   meta: { title: 'realTimeMonitorList.enclosure' },
      //   redirect: '/realTimeMonitor/enclosure/prisonArea1',
      //   children: [
      //     {
      //       path: 'prisonArea1',
      //       component: () => import('@/views/realTimeMonitor/enclosure/prisonArea1'),
      //       name: 'PrisonArea1',
      //       meta: { title: 'realTimeMonitorList.enclosureList.prisonArea1' }
      //     },
      //     {
      //       path: 'prisonArea2',
      //       component: () => import('@/views/realTimeMonitor/enclosure/prisonArea2'),
      //       name: 'realTimeMonitorList.enclosureList.prisonArea2',
      //       meta: { title: 'realTimeMonitorList.enclosureList.prisonArea2' }
      //     },
      //     // {
      //     //   path: 'prisonArea3',
      //     //   component: () => import('@/views/realTimeMonitor/enclosure/prisonArea3'),
      //     //   name: 'realTimeMonitorList.enclosureList.prisonArea3',
      //     //   meta: { title: 'realTimeMonitorList.enclosureList.prisonArea3' }
      //     // }
      //   ]
      // },
      {
        path: 'healthMonitoring',
        component: () => import('@/views/realTimeMonitor/healthMonitoring/index'), // Parent router-view
        // name: 'Menu1',
        meta: { title: 'realTimeMonitorList.healthMonitoring' },
        redirect: '/realTimeMonitor/healthMonitoring/prisoner',
        alwaysShow: true,
        children: [
          {
            path: 'prisoner',
            component: () => import('@/views/realTimeMonitor/healthMonitoring/prisoner/prisonerStatistics'),
            name: 'prisoner',
            meta: { title: 'realTimeMonitorList.healthMonitoringList.prisoner' }
          },
          // {
          //   path: 'supervisor',
          //   component: () => import('@/views/realTimeMonitor/healthMonitoring/supervisor/supervisorStatistics'),
          //   name: 'supervisor',
          //   meta: { title: 'realTimeMonitorList.healthMonitoringList.supervisor' }
          // }
        ]
      }
    ]
  },
  {
    path: '/deviceManagement',
    component: Layout,
    redirect: '/deviceManagement/deviceBinding',
    name: 'DeviceManagement',
    meta: {
      title: 'deviceManagement',
      icon: 'shebeiguanli'
    },
    children: [
      {
        path: 'personBindingDevice',
        component: () => import('@/views/deviceManagement/personBindingDevice'),
        name: 'personBindingDevice',
        meta: {
          title: 'deviceBinding',
          noCache: true
        }
      },
      {
        path: 'deviceUnbinding',
        component: () => import('@/views/deviceManagement/deviceUnbinding'),
        name: 'deviceUnbinding',
        meta: {
          //title: 'deviceBinding',
          title: 'unbindingRecords',
          //
          noCache: true
        }
      },
      /*  {
         path: 'unbindingRecords',
         component: () => import('@/views/deviceManagement/unbindingRecords'),
         name: 'UnbindingRecords',
         meta: {
           title: 'unbindingRecords',
           //
           noCache: true
         }
       }, */

      {
        path: 'electricityEarlyWarning',
        component: () => import('@/views/deviceManagement/electricityEarlyWarning'),
        name: 'ElectricityEarlyWarning',
        meta: {
          title: 'electricityEarlyWarning',
          //
          noCache: true
        }
      },
      // {
      //   path: 'personnelFiles',
      //   component: () => import('@/views/deviceManagement/personnelFiles'),
      //   name: 'PersonnelFiles',
      //   meta: {
      //     title: 'personnelFiles',
      //     //
      //     noCache: true
      //   }
      // },
      // {
      //   path: 'lostContactAlarm',
      //   component: () => import('@/views/deviceManagement/lostContactAlarm'),
      //   name: 'LostContactAlarm',
      //   meta: {
      //     title: 'lostContactAlarm',
      //     //
      //     noCache: true
      //   }
      // },
      {
        path: 'deviceList',
        component: () => import('@/views/deviceManagement/deviceList'),
        name: 'deviceList',
        meta: {
          title: '设备列表',
          //
          noCache: true
        }
      }
    ]
  },
  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  // 报警处理
  /*
    {
      path: '/prisoner',
      component: Layout,
      redirect: '/prisoner/personnelManagement',
      name: 'prisoner',
      meta: {
        title: 'prisoner',
        icon: 'example'
      },
      children: [
        {
          path: 'personnelManagement',
          component: () => import('@/views/prisoner/personnelManagement'),
          name: 'PersonnelManagement',
          meta: { title: 'prisonerList.personnelManagement',  noCache: true }
        },
        {
          path: 'outRegistration',
          component: () => import('@/views/prisoner/outRegistration'),
          name: 'OutRegistration',
          meta: { title: 'prisonerList.outRegistration',  noCache: true }
        },
        {
          path: 'nowRollCall',
          component: () => import('@/views/prisoner/nowRollCall'),
          name: 'NowRollCall',
          meta: { title: 'prisonerList.nowRollCall',  noCache: true }
        },
        {
          path: 'timingRollCall',
          component: () => import('@/views/prisoner/timingRollCall'),
          name: 'TimingRollCall',
          meta: { title: 'prisonerList.timingRollCall',  noCache: true }
        },
        // {
        //   path: 'surveillanceCardiaque',
        //   component: () => import('@/views/prisoner/surveillanceCardiaque'),
        //   name: 'SurveillanceCardiaque',
        //   meta: { title: 'prisonerList.surveillanceCardiaque',  noCache: true }
        // },
      ]
    },
  */

  // {
  //   path: '/custodian',
  //   component: Layout,
  //   redirect: '/custodian/personnelManagement',
  //   name: 'custodian',
  //   meta: {
  //     title: 'custodian',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'personnelManagement',
  //       component: () => import('@/views/custodian/personnelManagement'),
  //       name: 'PersonnelManagement',
  //       meta: { title: 'custodianList.personnelManagement',  noCache: true }
  //     },
  //     {
  //       path: 'outRegistration',
  //       component: () => import('@/views/custodian/outRegistration'),
  //       name: 'OutRegistration',
  //       meta: { title: 'custodianList.outRegistration',  noCache: true }
  //     },
  //     {
  //       path: 'nowRollCall',
  //       component: () => import('@/views/custodian/nowRollCall'),
  //       name: 'NowRollCall',
  //       meta: { title: 'custodianList.nowRollCall',  noCache: true }
  //     },
  //     {
  //       path: 'timingRollCall',
  //       component: () => import('@/views/custodian/timingRollCall'),
  //       name: 'TimingRollCall',
  //       meta: { title: 'custodianList.timingRollCall',  noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/surveillanceSanitaire',
  //   component: Layout,
  //   redirect: '/surveillanceSanitaire/surveillanceCardiaque',
  //   name: 'SurveillanceSanitaire',
  //   meta: {
  //     title: 'surveillanceSanitaire',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'surveillanceCardiaque',
  //       component: () => import('@/views/surveillanceSanitaire/surveillanceCardiaque'),
  //       name: 'SurveillanceCardiaque',
  //       meta: {
  //         title: 'surveillanceCardiaque',
  //         //
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: 'bloodPressureMonitoring',
  //       component: () => import('@/views/surveillanceSanitaire/bloodPressureMonitoring'),
  //       name: 'BloodPressureMonitoring',
  //       meta: {
  //         title: 'bloodPressureMonitoring',
  //         // icon: 'list',
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: 'earlyWarningRecord',
  //       component: () => import('@/views/surveillanceSanitaire/earlyWarningRecord'),
  //       name: 'EarlyWarningRecord',
  //       meta: {
  //         title: 'earlyWarningRecord',
  //         // icon: 'list',
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: 'healthRecords',
  //       component: () => import('@/views/surveillanceSanitaire/healthRecords'),
  //       name: 'HealthRecords',
  //       meta: {
  //         title: 'healthRecords',
  //         // icon: 'list',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/alarmProcessing',
    component: Layout,
    redirect: '/alarmProcessing/healthAlarm',
    name: 'AlarmProcessing',
    meta: {
      title: 'alarmProcessing',
      icon: 'baojingguanli'
    },
    children: [
      {
        path: 'healthAlarm',
        component: () => import('@/views/alarmProcessing/healthAlarm'),
        name: 'HealthAlarm',
        meta: { title: 'healthAlarm',  noCache: true }
      },
      {
        path: 'transboundaryAlarm',
        component: () => import('@/views/alarmProcessing/transboundaryAlarm'),
        name: 'TransboundaryAlarm',
        meta: { title: 'transboundaryAlarm',  noCache: true }
      },
      {
        path: 'SOSAlarm',
        component: () => import('@/views/alarmProcessing/SOSAlarm'),
        name: 'SOSAlarm',
        meta: { title: 'SOSAlarm',  noCache: true }
      },
      {
        path: 'policeAlarm',
        component: () => import('@/views/alarmProcessing/policeAlarm'),
        name: 'PoliceAlarm',
        meta: { title: 'policeAlarm',  noCache: true }
      },
      {
        path: 'specialAreaAlarm',
        component: () => import('@/views/alarmProcessing/specialAreaAlarm'),
        name: 'SpecialAreaAlarm',
        meta: { title: 'specialAreaAlarm',  noCache: true }
      },
      {
        path: 'noSignalAlarm',
        component: () => import('@/views/alarmProcessing/noSignalAlarm'),
        name: 'NoSignalAlarm',
        meta: { title: 'noSignalAlarm',  noCache: true }
      },
      // {
      //   path: 'destruction',
      //   component: () => import('@/views/alarmProcessing/destruction'),
      //   name: 'Destruction',
      //   meta: { title: 'destruction', icon: 'list', noCache: true }
      // }
    ]
  },
  {
    path: '/dataStatistics',
    component: Layout,
    redirect: '/dataStatistics/healthStatistics',
    name: 'DataStatistics',
    meta: {
      title: 'dataStatistics',
      icon: 'shujutongji'
    },
    children: [
      {
        path: 'healthStatistics',
        component: () => import('@/views/dataStatistics/healthStatistics'),
        name: 'HealthStatistics',
        meta: { title: 'dataStatisticsList.healthStatistics',  noCache: true }
      },
      {
        path: 'rollCallStatistics',
        component: () => import('@/views/dataStatistics/rollCallStatistics'),
        name: 'RollCallStatistics',
        meta: { title: 'dataStatisticsList.rollCallStatistics',  noCache: true }
      },
      {
        path: 'alarmStatistics',
        component: () => import('@/views/dataStatistics/alarmStatistics'),
        name: 'AlarmStatistics',
        meta: { title: 'dataStatisticsList.alarmStatistics',  noCache: true }
      }
    ]
  },
  {
    path: '/systemManagement',
    component: Layout,
    redirect: '/systemManagement/permissionManagement',
    alwaysShow: true, // will always show the root menu
    name: 'SystemManagement',
    meta: {
      title: 'systemManagement',
      icon: 'xitongguanli',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'permissionManagement',
        component: () => import('@/views/systemManagement/permissionManagement'),
        name: 'PermissionManagement',
        meta: {
          title: 'permissionManagement',
          roles: ['admin']
        }
      },
      {
        path: 'regionalManage',
        component: () => import('@/views/systemManagement/regionalManage.vue'),
        name: 'RegionalManage',
        meta: {
          title: 'regionalManage',
          roles: ['admin']
        }
      },
      {
        path: 'thresholdSetting',
        component: () => import('@/views/systemManagement/thresholdSetting.vue'),
        name: 'thresholdSetting',
        meta: {
          title: 'thresholdSetting',
          roles: ['admin']
        }
      },
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

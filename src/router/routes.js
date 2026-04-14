export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: 'Login',
      public: true,
      icon: '🔐'
    }
  },

  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    children: [

      // ================= PUBLIC =================
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: 'Home',
          icon: '🏠',
          level: 0
        }
      },

      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/views/About.vue'),
        meta: {
          title: 'Contact',
          icon: '📞',
          level: 9
        }
      },

      // ================= USER =================
      {
        path: 'MonHoc',
        component: { render: h => h('router-view') },
        meta: {
          title: 'MonHoc',
          icon: '📦',
          level: 9
        },
        children: [
          {
            path: 'Toan',
            name: 'MonHoc-Toan',
            component: () => import('@/views/MonHoc/Toan.vue'),
            meta: { title: 'Toan', icon: '📐', level: 9 }
          },
          {
            path: 'Ly',
            name: 'MonHoc-Ly',
            component: () => import('@/views/MonHoc/Ly.vue'),
            meta: { title: 'Ly', icon: '⚡', level: 9 }
          },

          // 🔥 divider
          {
            path: 'Hoa',
            name: 'MonHoc-Hoa',
            component: () => import('@/views/MonHoc/Hoa.vue'),
            meta: { title: 'Hoa', icon: '🧪', level: 9, divider: true }
          },

          {
            path: 'Icons2',
            name: 'MonHoc-Icons2',
            component: () => import('@/views/MonHoc/Icons2.vue'),
            meta: { title: 'Icons2', icon: '🎨', level: 9 }
          }
        ]
      },

      {
        path: 'Table',
        component: { render: h => h('router-view') },
        meta: {
          title: 'Table',
          icon: '📦',
          level: 9
        },
        children: [
          {
            path: 'TestTableProvide',
            name: 'Table-TestTableProvide',
            component: () => import('@/views/Table/TestTableProvide.vue'),
            meta: { title: 'TestTableProvide', icon: '💰', level: 9 }
          },
          {
            path: 'TestTableData',
            name: 'Table-TestTableData',
            component: () => import('@/views/Table/TestTableData.vue'),
            meta: { title: 'TestTableData', icon: '📉', level: 9 }
          },
          {
            path: 'CrudTableCom',
            name: 'Table-CrudTableCom',
            component: () => import('@/views/Table/CrudTableCom.vue'),
            meta: { title: 'CrudTableCom', icon: '📊', level: 9  }
          },
          {
            path: 'TestModalBase',
            name: 'Table-TestModalBase',
            component: () => import('@/views/Table/TestModalBase.vue'),
            meta: { title: 'TestModalBase', icon: '📐', level: 9 , divider : 1 }
          },
          {
            path: 'DbManager',
            name: 'Table-DbManager',
            component: () => import('@/views/Table/DbManager.vue'),
            meta: { title: 'DbManager', icon: '📐', level: 9 , divider : 1 }
          },

          {
            path: 'TableModal',
            name: 'Table-TableModal',
            component: () => import('@/views/Table/TableModal.vue'),
            meta: { title: 'TableModal', icon: '📐', level: 9 }
          },




        ]
      },


      
      {
        path: 'ThuChi',
        component: { render: h => h('router-view') },
        meta: {
          title: 'ThuChi',
          icon: '📦',
          level: 0
        },
        children: [
          {
            path: 'TableProviderThu',
            name: 'ThuChi-TableProviderThu',
            component: () => import('@/views/ThuChi/TableProviderThu.vue'),
            meta: { title: 'Thu', icon: '📐', level: 0 }
          },
          
          {
            path: 'TableProviderChi',
            name: 'ThuChi-TableProviderChi',
            component: () => import('@/views/ThuChi/TableProviderChi.vue'),
            meta: { title: 'Chi', icon: '📐', level: 0 }
          },

          
          {
            path: 'TongHopThuChi',
            name: 'ThuChi-TongHopThuChi',
            component: () => import('@/views/ThuChi/TongHopThuChi.vue'),
            meta: { title: 'TongHopThuChi', icon: '📐', level: 9 }
          },
//TongHopThuChi2.vue
          {
            path: 'TongHopThuChi2',
            name: 'ThuChi-TongHopThuChi2',
            component: () => import('@/views/ThuChi/TongHopThuChi2.vue'),
            meta: { title: 'Tổng hợp', icon: '📐', level: 0 }
          },







        ]
      },














    ]
  },

  {
    path: '*',
    redirect: '/home'
  }
]
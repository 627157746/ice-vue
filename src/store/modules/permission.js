import { constantRoutes } from '@/router'
import { getMenusByCurrentUser } from '@/api/menu'
import Layout from '@/layout'

const routeMap = {
  user: () => import('@/views/admin/user/index'),
  role: () => import('@/views/admin/role/index'),
  menu: () => import('@/views/admin/menu/index'),
  dept: () => import('@/views/admin/dept/index'),
  client: () => import('@/views/setting/client/index'),
  dict: () => import('@/views/setting/dict/index'),
  log: () => import('@/views/setting/log/index'),
  token: () => import('@/views/setting/token/index')
}
export const asyncRoutes = [

]
export function generaMenu(routes, data) {
  data.forEach(item => {
    let component
    if (item.component === 'Layout') {
      component = Layout
    } else {
      component = routeMap[`${item.component}`]
    }
    const menu = {
      path: item.path,
      component: component,
      hidden: item.hidden,
      noCache: item.noCache,
      children: [],
      meta: { title: item.name, icon: item.icon }
    }
    if (item.component !== 'Layout') {
      menu.name = item.component
    } else {
      menu.redirect = 'noRedirect'
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
  const notFoundPage = { path: '*', redirect: '/404', hidden: true }
  routes.push(notFoundPage)
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(async resolve => {
      const loadMenuData = []
      await getMenusByCurrentUser().then(res => {
        const data = res.data
        Object.assign(loadMenuData, data)
        generaMenu(asyncRoutes, loadMenuData)
      })
      commit('SET_ROUTES', asyncRoutes)
      resolve(asyncRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

import { constantRoutes } from '@/router'
import { getMenusByCurrentUser } from '@/api/menu'
import Layout from '@/layout'

const componentMap = {
  User: () => import('@/views/admin/user'),
  Role: () => import('@/views/admin/role'),
  Menu: () => import('@/views/admin/menu'),
  Dept: () => import('@/views/admin/dept'),
  Client: () => import('@/views/setting/client'),
  Dict: () => import('@/views/setting/dict'),
  Log: () => import('@/views/setting/log'),
  Token: () => import('@/views/setting/token'),
  Host: () => import('@/views/setting/host'),
  FormGen: () => import('@/views/tools/form-gen'),
  CodeGen: () => import('@/views/tools/code-gen')
}
const asyncRoutes = []

export function generaMenu(routes, data) {
  data.forEach((item) => {
    let component
    if (item.component === 'Layout') {
      component = Layout
    } else {
      component = componentMap[`${item.component}`]
    }
    const menu = {
      path: item.path,
      name: item.routeName,
      component: component,
      hidden: item.hidden,
      children: [],
      meta: { title: item.name, icon: item.icon, noCache: item.noCache }
    }
    if (item.component === 'Layout') {
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

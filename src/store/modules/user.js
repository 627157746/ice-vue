import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Encrypt } from '../../utils/aes.js'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: Encrypt(password), 'grant_type': 'password' }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.accessToken)
        setToken(data.accessToken)
        localStorage.setItem('name', data.username)
        localStorage.setItem('avatar', data.avatar)
        localStorage.setItem('roles', data.roleIds)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const name = localStorage.getItem('name')
      const avatar = localStorage.getItem('avatar')
      const roles = localStorage.getItem('roles')
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_ROLES', roles)
      const userInfo = {
        name: name,
        avatar: avatar,
        roles: roles
      }
      resolve(userInfo)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ access_token: state.token }).then(() => {
        removeToken() // must remove  token  first
        localStorage.removeItem('name')
        localStorage.removeItem('avatar')
        localStorage.removeItem('roles')
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


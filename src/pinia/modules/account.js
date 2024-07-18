import { defineStore } from 'pinia'
import { GetUserinfo } from '@/api/login'
import { removeItem } from '@/utils/storage.js'

export const useAccount = defineStore('account', {
  state: () => ({
    userinfo: null,
    permissionList: []
  }),
  actions: {
    // 清除用户信息
    clearUserinfo() {
      this.userinfo = null
    },
    // 获取用户信息
    async getUserinfo() {
      const { code, data } = await GetUserinfo()
      if (code === 200) {
        console.log('获取用户信息成功！')
        this.userinfo = data
        return Promise.resolve(data)
      } else if (code === 206) {
        throw new Error('获取用户信息失败！')
      }
    }
  },
  persist: true
})

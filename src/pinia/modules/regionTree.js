import { defineStore } from 'pinia'
import { GetRegion } from '@/api/sysRegion.js'
import { getItem, setItem } from '@/utils/storage.js'

export const initRegionTree = defineStore('reginTree', () => {
  const getRegionTree = async () => {
    if (!getItem('regionTree')) {
      await setRegionTree()
    }
    return getItem('regionTree')
  }
  const setRegionTree = async () => {
    const { data } = await GetRegion()
    setItem('regionTree', data)
  }
  return {
    getRegionTree,
    setRegionTree
  }
},{ persist: true })

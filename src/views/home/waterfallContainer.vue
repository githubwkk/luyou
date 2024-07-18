<template>
  <Navs />
  <PersonMenu class="menu" />
  <div class="space" v-loading="loading">
    <div class="waterfall-container">
      <FsWaterFall :gap="15" :column="5" :request="requestData" :page-size="30">
        <template #item="{ item }">
          <el-image :src="item.url" alt="图片" class="image" lazy></el-image>
        </template>
      </FsWaterFall>
    </div>
  </div>
</template>

<script setup lang="ts">

import { IImageItem } from '@/views/home/components/type'
import FsWaterFall from '@/views/home/components/FsWaterFall.vue'
import { GetWaterfallImg } from '@/api/home/home'
import Navs from '@/views/home/Navs.vue'
import PersonMenu from '@/views/home/components/PersonMenu.vue'
import {ref} from "vue";

const loading=ref(true)
const requestData = async (page: number, pageSize: number): Promise<IImageItem[]> => {
  const { data } = await GetWaterfallImg(page - 1, pageSize)
  return new Promise<IImageItem[]>((resolve) => {
    const imageList: IImageItem[] = data.records.map((i: any) => ({
      id: i.id,
      url: i.photoUrls,
      height: i.height,
      width: i.width
    }))
    loading.value=false
    return resolve(imageList)

  })
}
</script>

<style scoped lang="scss">
.menu {
  position: absolute;
  top: 12px;
  right: 15px;
}

.space {
  margin: 20px auto 0;
  width: 80vw;
  height: 90vh;

  .waterfall-container {
    width: 100%;
    height: 100%;

    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

</style>

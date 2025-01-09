<script setup>
import { onMounted, ref } from 'vue'
import Versions from './components/Versions.vue'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')

const mode = ref(null)
const status = ref(null)
const operating = ref(false)

const start = () => {
  if (operating.value) {
    alert('操作中...')
    return
  }
  operating.value = true

  window.api
    .start(mode.value)
    .catch((err) => {
      console.error('start failed:', err)
    })
    .finally(() => {
      setTimeout(() => {
        operating.value = false
      }, 500)
    })
}

const close = () => {
  if (operating.value) {
    alert('操作中...')
    return
  }
  operating.value = true

  window.api
    .close()
    .catch((err) => {
      console.error('close failed:', err)
    })
    .finally(() => {
      setTimeout(() => {
        operating.value = false
      }, 500)
    })
}

const changeMode = (m) => {
  if (operating.value) {
    alert('操作中...')
    return
  }
  operating.value = true

  window.api
    .changeMode(m)
    .catch((err) => {
      console.error('changeMode failed:', err)
    })
    .finally(() => {
      setTimeout(() => {
        operating.value = false
      }, 500)
    })
}

onMounted(() => {
  window.api
    .data()
    .then((data) => {
      mode.value = data?.mode
      status.value = data?.status
    })
    .catch((err) => {
      console.error('data failed:', err)
    })

  window.api.listenData((data) => {
    mode.value = data?.mode
    status.value = data?.status
  })
})
</script>

<template>
  <div class="actions">
    <div class="action">
      <a v-if="status === 'off'" @click="start">启动</a>
      <a v-if="status === 'on'" @click="close">关闭</a>
    </div>
  </div>
  <div class="actions">
    <div class="action">
      <a @click="changeMode('rule')" :class="{ active: mode === 'rule' }">智能</a>
    </div>
    <div class="action">
      <a @click="changeMode('global')" :class="{ active: mode === 'global' }">全局</a>
    </div>
  </div>
</template>

<style scoped>
.action a.active {
  color: #2daa46;
}
</style>
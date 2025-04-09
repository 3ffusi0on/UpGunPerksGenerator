<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3"
      :class="typeClass"
    >
      <SuccessIcon v-if="currentType === 'success'" />
      <ErrorIcon v-else-if="currentType === 'error'" />
      <span>{{ currentMessage }}</span>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import SuccessIcon from '../assets/icons/SuccessIcon.vue'
import ErrorIcon from '../assets/icons/ErrorIcon.vue'

const props = defineProps<{
  message: string
  duration?: number
  type?: 'success' | 'error' | 'info'
}>()

const visible = ref(false)
let timeoutId: number | null = null

const currentMessage = ref(props.message)
const currentType = ref(props.type || 'success')
const typeClass = ref('')

watchEffect(() => {
  switch (currentType.value) {
    case 'success':
      typeClass.value = 'bg-green-700'
      break
    case 'error':
      typeClass.value = 'bg-red-700'
      break
    case 'info':
    default:
      typeClass.value = 'bg-blue-700'
      break
  }
})

interface ToastOptions {
  message?: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

const show = (options?: ToastOptions) => {
  if (options) {
    currentMessage.value = options.message || props.message
    currentType.value = options.type || props.type || 'success'
  } else {
    currentMessage.value = props.message
    currentType.value = props.type || 'success'
  }

  visible.value = true

  if (timeoutId !== null) {
    clearTimeout(timeoutId)
  }

  const duration = options?.duration || props.duration || 3000
  timeoutId = setTimeout(() => {
    visible.value = false
  }, duration) as unknown as number
}

const hide = () => {
  visible.value = false
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

defineExpose({
  show,
  hide,
})
</script>

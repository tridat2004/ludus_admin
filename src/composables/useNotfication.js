// composables/useNotification.js
import { ref } from 'vue'

const message = ref('')
const type = ref('info')
const isVisible = ref(false)

export function useNotification() {
  const notify = (msg, msgType = 'info', timeout = 3000) => {
    message.value = msg
    type.value = msgType
    isVisible.value = true
    setTimeout(() => isVisible.value = false, timeout)
  }

  return { message, type, isVisible, notify }
}

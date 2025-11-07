import { ref } from 'vue'

// Global shared state
const message = ref('')
const type = ref('info')
const isVisible = ref(false)
let timeoutId = null

export function useNotification() {
  const notify = (msg, msgType = 'info', timeout = 3000) => {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    message.value = msg
    type.value = msgType
    isVisible.value = true
    
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        isVisible.value = false
      }, timeout)
    }
  }

  const hide = () => {
    isVisible.value = false
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  return { 
    message, 
    type, 
    isVisible, 
    notify,
    hide
  }
}
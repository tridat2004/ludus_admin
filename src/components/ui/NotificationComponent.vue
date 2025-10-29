<template>
  <Teleport to="body">
    <Transition name="notification">
      <div 
        v-if="isVisible" 
        :class="[
          'fixed top-4 right-4 z-50 max-w-sm w-full',
          'bg-white rounded-lg shadow-lg border-l-4 p-4',
          'flex items-start space-x-3',
          notificationClasses
        ]"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="type === 'success'" class="h-6 w-6 text-green-500" />
          <XCircleIcon v-else-if="type === 'error'" class="h-6 w-6 text-red-500" />
          <ExclamationTriangleIcon v-else-if="type === 'warning'" class="h-6 w-6 text-yellow-500" />
          <InformationCircleIcon v-else class="h-6 w-6 text-blue-500" />
        </div>

        <!-- Message -->
        <div class="flex-1 pt-0.5">
          <p class="text-sm font-medium text-gray-900">{{ message }}</p>
        </div>

        <!-- Close button -->
        <button 
          @click="isVisible = false"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

// ✅ Nuxt auto-import composables - không cần import
const { message, type, isVisible } = useNotification()

const notificationClasses = computed(() => {
  const classes = {
    success: 'border-green-500',
    error: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500'
  }
  return classes[type.value] || classes.info
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
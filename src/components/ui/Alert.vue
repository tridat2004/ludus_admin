<template>
  <div v-if="!dismissed" :class="alertClasses" role="alert">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <component :is="iconComponent" class="h-5 w-5" />
      </div>
      <div class="ml-3 flex-1">
        <h3 v-if="title" class="text-sm font-medium">{{ title }}</h3>
        <div :class="title ? 'mt-1 text-sm' : 'text-sm'">
          <slot />
        </div>
      </div>
      <div v-if="closable" class="ml-auto pl-3">
        <button
          @click="dismiss"
          class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="closeButtonClasses"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'error', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const dismissed = ref(false)

const alertClasses = computed(() => {
  const variants = {
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  }
  
  return `rounded-lg border p-4 ${variants[props.variant]}`
})

const closeButtonClasses = computed(() => {
  const variants = {
    success: 'text-green-500 hover:bg-green-100 focus:ring-green-600',
    warning: 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
    error: 'text-red-500 hover:bg-red-100 focus:ring-red-600',
    info: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
  }
  
  return variants[props.variant]
})

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon
  }
  
  return icons[props.variant]
})

const dismiss = () => {
  dismissed.value = true
  emit('close')
}
</script>
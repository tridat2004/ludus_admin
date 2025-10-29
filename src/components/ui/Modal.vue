<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="closeOnBackdrop && close()"
        ></div>
        
        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div 
            :class="modalClasses"
            @click.stop
          >
            <!-- Header -->
            <div v-if="title || $slots.header" class="flex items-center justify-between p-6 border-b border-gray-200">
              <slot name="header">
                <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
              </slot>
              <button 
                v-if="closable"
                @click="close"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
            
            <!-- Body -->
            <div :class="bodyClasses">
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'md', validator: v => ['sm','md','lg','xl','full'].includes(v) },
  closable: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true },
  noPadding: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }  // ĐÃ THÊM
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalClasses = computed(() => {
  const classes = [
    'relative bg-white rounded-lg shadow-xl transform transition-all',
    'w-full'
  ]
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  }
  classes.push(sizeClasses[props.size])
  
  return classes.join(' ')
})

const bodyClasses = computed(() => {
  if (props.noPadding) {
    return ''
  }
  return 'p-6'
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Lock body scroll when modal is open
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
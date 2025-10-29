<template>
  <div class="relative" ref="dropdownRef">
    <div @click="toggle">
      <slot name="trigger" :isOpen="isOpen" />
    </div>
    
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        :class="dropdownClasses"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  placement: {
    type: String,
    default: 'bottom-end',
    validator: (value) => ['bottom-start', 'bottom-end', 'top-start', 'top-end'].includes(value)
  },
  width: {
    type: String,
    default: 'w-48'
  }
})

const emit = defineEmits(['open', 'close'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const dropdownClasses = computed(() => {
  const classes = [
    'absolute z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1',
    props.width
  ]
  
  const placementClasses = {
    'bottom-start': 'left-0',
    'bottom-end': 'right-0',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2'
  }
  classes.push(placementClasses[props.placement])
  
  return classes.join(' ')
})

const toggle = () => {
  isOpen.value = !isOpen.value
  emit(isOpen.value ? 'open' : 'close')
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({ close })
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
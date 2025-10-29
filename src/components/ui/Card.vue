<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  hover: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  const classes = ['bg-white rounded-lg shadow-sm border border-gray-200']
  
  if (props.hover) {
    classes.push('hover:shadow-md transition-shadow duration-200 cursor-pointer')
  }
  
  return classes.join(' ')
})

const bodyClasses = computed(() => {
  if (props.noPadding) {
    return ''
  }
  return 'p-6'
})
</script>

<style scoped>
.card-header {
  @apply px-6 py-4 border-b border-gray-200;
}

.card-footer {
  @apply px-6 py-4 border-t border-gray-200 bg-gray-50;
}
</style>
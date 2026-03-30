<template>
  <div v-if="loading" class="loading-message">
    <span class="spinner"></span> Loading device database...
  </div>
  <div v-else-if="error" class="error-message">
    Failed to load database: {{ error }}
  </div>
  <div v-else class="data-info">
    <span>
      Showing {{ filteredCount }} of {{ totalCount }} devices
    </span>
    <span v-if="generationTime">
      Database updated: {{ formattedTime }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: Boolean,
  error: String,
  filteredCount: Number,
  totalCount: Number,
  generationTime: String,
})

const formattedTime = computed(() => {
  if (!props.generationTime) return ''
  try {
    return new Date(props.generationTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  } catch {
    return props.generationTime
  }
})
</script>

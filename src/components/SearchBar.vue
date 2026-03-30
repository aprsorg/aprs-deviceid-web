<template>
  <div class="search-bar">
    <input
      class="search-input"
      type="text"
      :value="modelValue"
      @input="onInput"
      placeholder="Search by tocall, vendor, or model..."
    />
    <select
      class="class-filter"
      :value="classFilter"
      @change="$emit('update:classFilter', $event.target.value)"
    >
      <option value="">All classes</option>
      <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.shown }}</option>
    </select>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: String,
  classFilter: String,
  classes: Array,
})

const emit = defineEmits(['update:modelValue', 'update:classFilter'])

let debounceTimer = null
function onInput(e) {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', e.target.value)
  }, 150)
}
</script>

<template>
  <div v-if="devices.length === 0" class="no-results">
    No devices found matching your search.
  </div>
  <div v-else class="table-wrapper">
    <table class="results-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" @click="$emit('sort', col.key)">
            {{ col.label }}
            <span
              class="sort-arrow"
              :class="{ active: sortKey === col.key }"
            >{{ sortKey === col.key ? (sortAsc ? '\u25B2' : '\u25BC') : '\u25B2' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in devices" :key="d.identifier + d.source">
          <td class="tocall-cell">{{ d.identifier }}</td>
          <td>
            <span class="source-badge" :class="d.source">{{ sourceLabel(d.source) }}</span>
          </td>
          <td>{{ d.vendor }}</td>
          <td>{{ d.model }}</td>
          <td>{{ d.classShown }}</td>
          <td>{{ d.os }}</td>
          <td>
            <span v-for="f in d.features" :key="f" class="feature-tag">{{ f }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const columns = [
  { key: 'identifier', label: 'Tocall' },
  { key: 'source', label: 'Source' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'model', label: 'Model' },
  { key: 'classShown', label: 'Class' },
  { key: 'os', label: 'OS' },
  { key: 'features', label: 'Features' },
]

defineProps({
  devices: Array,
  sortKey: String,
  sortAsc: Boolean,
})

defineEmits(['sort'])

function sourceLabel(source) {
  if (source === 'mice') return 'Mic-E'
  if (source === 'micelegacy') return 'Mic-E Legacy'
  return 'Tocall'
}
</script>

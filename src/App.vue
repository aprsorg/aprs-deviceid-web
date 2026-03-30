<template>
  <header class="header">
    <div class="header-inner">
      <h1>APRS Device ID Search</h1>
      <p>
        Search the <a href="https://github.com/aprsorg/aprs-deviceid">APRS device identifier database</a>
        by tocall, vendor, or model name.
      </p>
    </div>
  </header>

  <main class="main">
    <SearchBar
      v-model="searchQuery"
      v-model:classFilter="classFilter"
      :classes="availableClasses"
    />

    <DataInfo
      :loading="loading"
      :error="error"
      :filteredCount="filteredDevices.length"
      :totalCount="allDevices.length"
      :generationTime="meta?.generation_time"
    />

    <ResultsTable
      v-if="!loading && !error"
      :devices="filteredDevices"
      :sortKey="sortKey"
      :sortAsc="sortAsc"
      @sort="toggleSort"
    />
  </main>

  <footer class="footer">
    Data source:
    <a href="https://github.com/aprsorg/aprs-deviceid">aprsorg/aprs-deviceid</a>
    &mdash; licensed under
    <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>
  </footer>
</template>

<script setup>
import SearchBar from './components/SearchBar.vue'
import ResultsTable from './components/ResultsTable.vue'
import DataInfo from './components/DataInfo.vue'
import { useDeviceData } from './composables/useDeviceData.js'

const {
  loading,
  error,
  meta,
  searchQuery,
  classFilter,
  sortKey,
  sortAsc,
  availableClasses,
  filteredDevices,
  allDevices,
  toggleSort,
} = useDeviceData()
</script>

import { ref, computed, onMounted } from 'vue'

const DATA_URL = 'https://aprs-deviceid.aprsfoundation.org/tocalls.dense.json'

export function useDeviceData() {
  const rawData = ref(null)
  const loading = ref(true)
  const error = ref(null)
  const searchQuery = ref('')
  const classFilter = ref('')
  const sortKey = ref('identifier')
  const sortAsc = ref(true)

  const allDevices = computed(() => {
    if (!rawData.value) return []

    const { classes, tocalls, mice, micelegacy } = rawData.value
    const devices = []

    for (const [id, entry] of Object.entries(tocalls || {})) {
      devices.push(normalizeEntry(id, 'tocall', entry, classes))
    }

    for (const [id, entry] of Object.entries(mice || {})) {
      devices.push(normalizeEntry(id, 'mice', entry, classes))
    }

    for (const [id, entry] of Object.entries(micelegacy || {})) {
      devices.push(normalizeEntry(id, 'micelegacy', entry, classes))
    }

    return devices
  })

  const availableClasses = computed(() => {
    if (!rawData.value?.classes) return []
    return Object.entries(rawData.value.classes)
      .map(([id, c]) => ({ id, shown: c.shown }))
      .sort((a, b) => a.shown.localeCompare(b.shown))
  })

  const filteredDevices = computed(() => {
    let results = allDevices.value

    if (classFilter.value) {
      results = results.filter(d => d.class === classFilter.value)
    }

    const q = searchQuery.value.trim()
    if (q) {
      const terms = q.toLowerCase().split(/\s+/)
      results = results.filter(d => terms.every(t => d.searchText.includes(t)))
    }

    const key = sortKey.value
    const dir = sortAsc.value ? 1 : -1
    results = [...results].sort((a, b) => {
      const av = a[key] || ''
      const bv = b[key] || ''
      return av.localeCompare(bv) * dir
    })

    return results
  })

  const meta = computed(() => rawData.value?.meta || null)

  function normalizeEntry(identifier, source, entry, classes) {
    const classShown = entry.class && classes?.[entry.class]
      ? classes[entry.class].shown
      : ''

    const searchText = [
      identifier,
      entry.vendor || '',
      entry.model || '',
      classShown,
      entry.os || '',
    ].join(' ').toLowerCase()

    return {
      identifier,
      source,
      vendor: entry.vendor || '',
      model: entry.model || '',
      class: entry.class || '',
      classShown,
      os: entry.os || '',
      contact: entry.contact || '',
      features: entry.features || [],
      searchText,
    }
  }

  function toggleSort(key) {
    if (sortKey.value === key) {
      sortAsc.value = !sortAsc.value
    } else {
      sortKey.value = key
      sortAsc.value = true
    }
  }

  async function fetchData() {
    loading.value = true
    error.value = null
    try {
      const resp = await fetch(DATA_URL)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)
      rawData.value = await resp.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData)

  return {
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
    fetchData,
  }
}

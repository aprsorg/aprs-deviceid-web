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
      // If the query is a single term that looks like a tocall, do
      // wildcard-aware lookup in addition to substring matching.
      const upper = q.toUpperCase()
      if (q.split(/\s+/).length === 1 && TOCALL_RE.test(upper)) {
        const wildcardMatches = tocallLookup(upper, results)
        const wcSet = new Set(wildcardMatches)
        // Also keep regular substring matches (vendor/model containing the term)
        const terms = q.toLowerCase().split(/\s+/)
        const substringMatches = results.filter(d => !wcSet.has(d) && terms.every(t => d.searchText.includes(t)))
        // Wildcard matches first (sorted by specificity), then substring matches
        results = [...wildcardMatches, ...substringMatches]
      } else {
        const terms = q.toLowerCase().split(/\s+/)
        results = results.filter(d => terms.every(t => d.searchText.includes(t)))
      }
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

    const hasWildcard = /[?*n]/.test(identifier) && source === 'tocall'

    const searchText = [
      identifier,
      entry.vendor || '',
      entry.model || '',
      classShown,
      entry.os || '',
    ].join(' ').toLowerCase()

    // For wildcard tocalls, pre-build a regex and a specificity score.
    // Specificity = number of literal (non-wildcard) characters — longer
    // literal prefix wins (e.g. APXYZ? beats APXY??).
    let wildcardRegex = null
    let specificity = 0
    if (hasWildcard) {
      let pattern = ''
      for (const ch of identifier) {
        if (ch === '?') { pattern += '[A-Z0-9]'; }
        else if (ch === '*') { pattern += '[A-Z0-9]*'; }
        else if (ch === 'n') { pattern += '[0-9]'; }
        else { pattern += ch; specificity++; }
      }
      wildcardRegex = new RegExp('^' + pattern + '$')
    } else if (source === 'tocall') {
      specificity = identifier.length + 1 // exact match wins over any wildcard
    }

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
      hasWildcard,
      wildcardRegex,
      specificity,
    }
  }

  // Check if a single search term looks like a tocall lookup
  // (3-6 uppercase letters/digits).
  const TOCALL_RE = /^[A-Z0-9]{3,6}$/

  // For a tocall-like term, find devices that match via exact or wildcard,
  // returning an array sorted by specificity (best match first).
  function tocallLookup(term, devices) {
    const matches = []
    for (const d of devices) {
      if (d.source !== 'tocall') continue
      if (!d.hasWildcard && d.identifier === term) {
        matches.push(d)
      } else if (d.wildcardRegex && d.wildcardRegex.test(term)) {
        matches.push(d)
      }
    }
    // Sort by specificity descending — exact and longest-literal-prefix first
    matches.sort((a, b) => b.specificity - a.specificity)
    return matches
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

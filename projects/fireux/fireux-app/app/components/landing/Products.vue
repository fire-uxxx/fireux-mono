<template>
  <section id="products" class="products-section">
    <h2 class="section-title">Our Products</h2>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">Loading ecosystem apps...</div>

    <!-- Products grid -->
    <div v-else class="products-grid">
      <FireOrganismsAppCardsCell
        v-for="app in apps"
        :key="app.appId"
        :app="app"
        @click="navigateToApp(app)"
      />
    </div>
  </section>
</template>

<script setup>
const { apps, loading, fetchApps } = useApps()

// Fetch apps on mount
onMounted(async () => {
  await fetchApps()
})

// Navigate to app
const navigateToApp = (app) => {
  if (app.appId === 'fireux-app') {
    // Navigate within the same app
    navigateTo(app.url)
  } else {
    // Open external app in new tab
    window.open(app.url, '_blank')
  }
}
</script>

<style scoped>
.products-section {
  padding: var(--space-4) var(--space-4) var(--space-16) var(--space-4);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--space-8);
  color: var(--ui-text);
}

.loading-state {
  text-align: center;
  color: var(--ui-text-muted);
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

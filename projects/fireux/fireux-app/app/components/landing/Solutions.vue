<!-- COMMENT: app/components/landing/Solutions.vue -->
<template>
  <section class="px-4">
    <div class="grid">
      <UCard
        v-for="solution in solutions"
        :key="solution.title"
        :to="solution.link"
        class="text-center"
      >
        <template #header>
          <h3>{{ solution.title }}</h3>
        </template>

        <p>{{ solution.description }}</p>

        <template #footer>
          <UButton variant="soft">
            {{ solution.buttonText }}
          </UButton>
        </template>
      </UCard>
    </div>
  </section>
</template>

<script setup>
const solutions = [
  {
    title: 'Products',
    description: 'Instant business tools, fully hosted and ready to go.',
    link: '/products',
    buttonText: 'Explore Products',
  },
  {
    title: 'White-Label',
    description: 'Rebrand and resell FIReUX products as your own.',
    link: '/whitelabel',
    buttonText: 'Become a Partner',
  },
  {
    title: 'SaaS',
    description:
      'Fully managed, subscription-based applications built for scale.',
    link: '/saas',
    buttonText: 'See SaaS Solutions',
  },
  {
    title: 'Templates',
    description: 'Pre-built software frameworks for developers and startups.',
    link: '/templates',
    buttonText: 'Browse Templates',
  },
  {
    title: 'API-First',
    description: 'Headless & modular, FIReUX integrates with any backend.',
    link: '/api',
    buttonText: 'Explore APIs',
  },
  {
    title: 'Automation',
    description: 'No-code triggers & workflows for seamless business ops.',
    link: '/automation',
    buttonText: 'Set Up Automations',
  },
]
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>

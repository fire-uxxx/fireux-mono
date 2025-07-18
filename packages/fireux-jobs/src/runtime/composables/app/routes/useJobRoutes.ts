// Export for public job routes
import type { RouteLink } from '../../../../../../fireux-core/src/runtime/types/routeLink'

export function getJobRoutes(): RouteLink[] {
  return [
    {
      label: 'Jobs',
      icon: 'i-lucide-briefcase',
      to: '/jobs',
    },
  ]
}

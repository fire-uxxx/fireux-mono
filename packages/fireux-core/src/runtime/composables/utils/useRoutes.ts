import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppUser } from '../firestore/AppUser/useAppUser'
import { useFireUXConfig } from '../FireUXConfig'

// Define a type for our route links.
interface RouteLink {
  label: string
  icon: string
  to?: string
  children?: RouteLink[]
}

// Function to generate route links, using runtime config for appName.
export function getRouteLinks() {
  const { appIcon, appName } = useFireUXConfig()

  // Format appIcon to be compatible with Nuxt UI's icon format
  const formattedAppIcon =
    typeof appIcon === 'string' && appIcon
      ? `i-lucide-${appIcon}`
      : 'i-lucide-app'

  return {
    app: [
      {
        label: typeof appName === 'string' ? appName : 'App',
        icon: formattedAppIcon,
        to: '/content',
      },
      { label: 'Products', icon: 'i-lucide-box', to: '/products' },
      { label: 'Blog', icon: 'i-lucide-book', to: '/blog' },
    ],
    dashboard: [
      {
        label: 'User',
        icon: 'i-lucide-user-circle',
        children: [
          {
            label: 'Overview',
            icon: 'i-lucide-layout-dashboard',
            to: '/dashboard',
          },
          { label: 'Profile', icon: 'i-lucide-user', to: '/dashboard/profile' },
          {
            label: 'Account',
            icon: 'i-lucide-settings',
            to: '/dashboard/account',
          },
          {
            label: 'Orders',
            icon: 'i-lucide-shopping-cart',
            to: '/dashboard/orders',
          },
          {
            label: 'Subscriptions',
            icon: 'i-lucide-credit-card',
            to: '/dashboard/subscriptions',
          },
          {
            label: 'Favorites',
            icon: 'i-lucide-heart',
            to: '/dashboard/favorites',
          },
        ],
      },
    ],
    admin: [
      {
        label: 'Admin',
        icon: 'i-lucide-shield-check',
        children: [
          {
            label: 'Overview',
            icon: 'i-lucide-layout-dashboard',
            to: '/admin',
          },
          { label: 'Users', icon: 'i-lucide-users', to: '/admin/users' },
          { label: 'Products', icon: 'i-lucide-box', to: '/admin/products' },
          { label: 'Blog', icon: 'i-lucide-book', to: '/admin/blog' },
          {
            label: 'Settings',
            icon: 'i-lucide-sliders',
            to: '/admin/settings',
          },
        ],
      },
    ],
  }
}

// Recursive function to search through route links.
function findLink(path: string, links: RouteLink[]): RouteLink | null {
  for (const link of links) {
    if (link.to === path) return link
    if (link.children) {
      const found = findLink(path, link.children)
      if (found) return found
    }
  }
  return null
}

// Returns route meta data (label and icon) for a given path.
export function getRouteMetaForPath(
  path: string,
  ROUTE_LINKS?: { app: RouteLink[]; dashboard: RouteLink[]; admin: RouteLink[] }
): { label: string; icon: string } {
  if (!ROUTE_LINKS) return { label: '', icon: '' }
  const match =
    findLink(path, ROUTE_LINKS.admin) ||
    findLink(path, ROUTE_LINKS.dashboard) ||
    findLink(path, ROUTE_LINKS.app)
  if (!match) return { label: '', icon: '' }
  return { label: match.label, icon: match.icon }
}

/**
 * useRoutes
 *
 * Returns:
 * - appLinks: Public routes (e.g. Products, Blog).
 * - dashboardLinks: Flat array of dashboard routes; if isAdmin then also include admin routes.
 * - mobileLinks: Groups all links (app, dashboard, and admin if isAdmin) into nested arrays.
 * - subHeader: Computed subheader for the current route.
 */
export function useRoutes() {
  console.log('%c🔍 useRoutes() called', 'color: blue; font-weight: bold;')

  const route = useRoute()
  const ROUTE_LINKS = getRouteLinks()

  // Try to get isAdmin safely, default to false if not available
  let isAdmin = ref(false)
  console.log('%c📊 Initial isAdmin ref:', 'color: cyan;', isAdmin)

  try {
    const appUser = useAppUser()
    console.log('%c✅ useAppUser successful:', 'color: green;', appUser)
    isAdmin = appUser.isAdmin || ref(false)
    console.log('%c📊 isAdmin from appUser:', 'color: cyan;', isAdmin)
  } catch (error) {
    // If useAppUser fails, just use false
    console.warn(
      'useAppUser not available in useRoutes, defaulting isAdmin to false'
    )
    isAdmin = ref(false)
    console.log('%c📊 Fallback isAdmin ref:', 'color: orange;', isAdmin)
  }

  // Public app links.
  const appLinks = computed<RouteLink[]>(() => {
    console.log('%c🔗 Computing appLinks', 'color: purple;')
    return ROUTE_LINKS.app
  })

  // Dashboard routes for desktop navigation (combined if admin).
  const dashboardLinks = computed<RouteLink[]>(() => {
    console.log(
      '%c🔗 Computing dashboardLinks, isAdmin.value:',
      'color: purple;',
      isAdmin.value
    )
    const dashboardParent = ROUTE_LINKS.dashboard[0]
    const dashboardChildren: RouteLink[] =
      dashboardParent && dashboardParent.children
        ? dashboardParent.children
        : []
    return isAdmin.value
      ? [...dashboardChildren, ...ROUTE_LINKS.admin]
      : dashboardChildren
  })

  // Mobile: group everything into nested arrays.
  const mobileLinks = computed<RouteLink[][]>(() => {
    console.log(
      '%c🔗 Computing mobileLinks, isAdmin.value:',
      'color: purple;',
      isAdmin.value
    )
    const groups: RouteLink[][] = []
    groups.push(ROUTE_LINKS.app)
    groups.push(ROUTE_LINKS.dashboard)
    if (isAdmin.value) {
      groups.push(ROUTE_LINKS.admin)
    }
    return groups
  })

  const subHeader = computed(() => {
    console.log('%c🔗 Computing subHeader', 'color: purple;')
    const title = route.meta?.title
    const icon = route.meta?.icon
    return {
      label: typeof title === 'string' ? title : 'Dashboard',
      icon: typeof icon === 'string' ? icon : 'i-lucide-layout-dashboard',
    }
  })

  const result = { appLinks, dashboardLinks, mobileLinks, subHeader }
  console.log(
    '%c🎯 useRoutes returning:',
    'color: green; font-weight: bold;',
    result
  )

  return result
}

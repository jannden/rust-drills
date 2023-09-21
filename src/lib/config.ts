import { DashboardConfig, SidebarConfig, SiteConfig } from '@/lib/types'

export const siteConfig: SiteConfig = {
  name: 'Frankie',
}

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: 'Updates',
      href: '/docs',
      disabled: true,
    },
    {
      title: 'Support',
      href: '/support',
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: 'Talks',
      href: '/dashboard',
      icon: 'post',
    },
    {
      title: 'Billing',
      href: '/dashboard/billing',
      icon: 'billing',
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: 'settings',
    },
  ],
}

export const sidebarConfig: SidebarConfig[] = [
  {
    section: 'Account',
    items: [
      {
        title: 'Profile',
        href: '/profile',
        icon: 'post',
      },
      {
        title: 'Account',
        href: '/profile/account',
        icon: 'media',
      },
      {
        title: 'Appearance',
        href: '/profile/appearance',
        icon: 'billing',
      },
    ],
  },

  {
    section: 'Account',
    items: [
      {
        title: 'Notifications',
        href: '/profile/notifications',
        icon: 'billing',
      },
      {
        title: 'Display',
        href: '/profile/display',
        icon: 'settings',
      },
      {
        title: 'New',
        href: '/disabled',
        disabled: true,
      },
    ],
  },
]

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'biens-immobilier',
    title: 'Biens Immobilier',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'buildings',
        title: 'Bâtiments',
        type: 'item',
        icon: 'feather icon-layers',
        url: '/demo/admin-page/buildings'
      },
      {
        id: 'owners',
        title: 'Propriétaires',
        type: 'collapse',
        icon: 'feather icon-user',
        children: [
          {
            id: 'owners-list',
            title: 'Liste des propriétaires',
            type: 'item',
            icon: 'feather icon-list',
            url: '/demo/admin-page/owners',
            classes: 'nav-child-icon'
          },
          {
            id: 'owners-payments',
            title: 'Paiements',
            type: 'item',
            icon: 'feather icon-credit-card',
            url: '/demo/admin-page/owners/payments',
            classes: 'nav-child-icon'
          }
        ]
      },
      {
        id: 'tenants',
        title: 'Locataires',
        type: 'item',
        icon: 'feather icon-users',
        url: '/demo/admin-page/tenants'
      },
      {
        id: 'apartments',
        title: 'Appartements',
        type: 'item',
        icon: 'feather icon-grid',
        url: '/demo/admin-page/apartments'
      },
      {
        id: 'rentals',
        title: 'Locations',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/demo/admin-page/rentals'
      },
      {
        id: 'recoveries',
        title: 'Recouvrements',
        type: 'collapse',
        icon: 'feather icon-dollar-sign',
        children: [
          {
            id: 'recoveries-list',
            title: 'Liste des recouvrements',
            type: 'item',
            icon: 'feather icon-list',
            url: '/demo/admin-page/recoveries',
            classes: 'nav-child-icon'
          },
          {
            id: 'recoveries-payments',
            title: 'Paiements',
            type: 'item',
            icon: 'feather icon-credit-card',
            url: '/demo/admin-page/recoveries/payments',
            classes: 'nav-child-icon'
          }
        ]
      }
    ]
  },
  {
    id: 'Authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'signup',
        title: 'Sign up',
        type: 'item',
        url: '/register',
        icon: 'feather icon-at-sign',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'signin',
        title: 'Sign in',
        type: 'item',
        url: '/login',
        icon: 'feather icon-log-in',
        target: true,
        breadcrumbs: false
      }
    ]
  },
];

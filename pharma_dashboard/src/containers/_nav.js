import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Distributor',
    to: '/distributor',
    icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Product',
    route: '/product',
    icon: 'cil-basket',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'All Product',
        to: '/product',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Type',
        to: '/product/type',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Category',
        to: '/product/category',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Division',
        to: '/product/division',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Packing',
        to: '/product/packing',
      }
    ]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Customer',
    to: '/customer',
    icon: <CIcon name="cil-people" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Notification',
    to: '/notification',
    icon: <CIcon name="cil-bell" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Gallery',
    to: '/gallery',
    icon: <CIcon name="cil-star" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Offers',
    to: '/offer',
    icon: <CIcon name="cil-list-rich" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Orders',
    to: '/orders',
    icon: <CIcon name="cil-notes" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Promotional',
    to: '/promotional',
    icon: <CIcon name="cil-map" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'About',
    to: '/about',
    icon: <CIcon name="cil-notes" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Certificate',
    to: '/certificate',
    icon: <CIcon name="cil-spreadsheet" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Enquiries',
    to: '/enquiries',
    icon: <CIcon name="cil-calculator" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Download',
    to: '/download',
    icon: <CIcon name="cil-share-boxed" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'State & City',
    to: '/state',
    icon: <CIcon name="cil-cursor" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Reports',
    to: '/summary',
    icon: <CIcon name="cil-list" customClasses="c-sidebar-nav-icon"/>,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Visits Summary',
        to: '/summary',
      }
    ]
  },
]

export default _nav

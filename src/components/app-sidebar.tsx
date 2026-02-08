'use client'

import * as React from 'react'
import {
  IconBriefcase,
  IconDashboard,
  IconInnerShadowTop,
  IconSettings,
  IconUsers,
  IconUserScreen,
} from '@tabler/icons-react'

import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'สรุปยอดรวม',
      url: '',
      icon: IconDashboard,
    },
    {
      title: 'สัญญา',
      url: 'contract',
      icon: IconBriefcase,
    },
    {
      title: 'คนงาน',
      url: 'worker',
      icon: IconUserScreen,
    },
  ],
  documents: [
    {
      name: 'ผู้ใช้',
      url: 'user',
      icon: IconUsers,
    },
    // {
    //   name: 'การตั้งค่า',
    //   url: 'settings',
    //   icon: IconSettings,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Mini Contract</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

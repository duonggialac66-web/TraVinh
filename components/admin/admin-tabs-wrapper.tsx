"use client"

import dynamic from "next/dynamic"
import type { LandingData } from "@/lib/content"

const AdminTabs = dynamic(() => import("./admin-tabs").then(m => m.AdminTabs), { ssr: false })

export function AdminTabsWrapper({ data, orders, users }: { data: LandingData, orders?: any[], users?: any[] }) {
  return <AdminTabs data={data} orders={orders} users={users} />
}

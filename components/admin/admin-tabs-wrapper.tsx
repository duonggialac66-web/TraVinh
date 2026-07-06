"use client"

import dynamic from "next/dynamic"
import type { LandingData } from "@/lib/content"

const AdminTabs = dynamic(() => import("./admin-tabs").then(m => m.AdminTabs), { ssr: false })

export function AdminTabsWrapper({ data, orders }: { data: LandingData, orders?: any[] }) {
  return <AdminTabs data={data} orders={orders} />
}

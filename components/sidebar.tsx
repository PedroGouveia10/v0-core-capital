"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Building2, FileText, Home, LayoutDashboard, Settings, Users } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="w-64 border-r border-gray-100 bg-white h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">CORE CAPITAL</h2>
        <p className="text-xs text-gray-500 mt-1">Acquisition Management</p>
      </div>

      <div className="px-3 py-2">
        <div className="space-y-1">
          <Link
            href="/"
            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
              isActive("/") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Home className="h-4 w-4 mr-3" />
            <span>Home</span>
          </Link>

          <Link
            href="/dashboard"
            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
              isActive("/dashboard")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 mr-3" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/pipeline"
            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
              isActive("/pipeline") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-3" />
            <span>Pipeline</span>
          </Link>

          <Link
            href="/crm"
            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
              isActive("/crm") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Building2 className="h-4 w-4 mr-3" />
            <span>CRM</span>
          </Link>

          <Link
            href="/due-diligence/cadastro"
            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
              isActive("/due-diligence")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FileText className="h-4 w-4 mr-3" />
            <span>Due Diligence</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Administração</h3>
            </div>
            <Link
              href="/users"
              className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                isActive("/users") ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="h-4 w-4 mr-3" />
              <span>Usuários</span>
            </Link>
            <Link
              href="/settings"
              className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                isActive("/settings")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Settings className="h-4 w-4 mr-3" />
              <span>Configurações</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 全站顶部导航 - 客户端组件（支持移动端菜单展开）
// Logo + 桌面导航 + 移动端汉堡菜单
// 链接：Instituciones / Quejas / Evaluar
// ============================================

'use client'

import { useState } from "react"
import Link from "next/link"

export default function Header() {
  // 移动端菜单开关状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 关闭菜单的辅助函数（点击链接后调用）
  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-2xl font-bold text-blue-700">Credito</span>
            <span className="text-2xl font-light text-gray-600">MX</span>
          </Link>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/instituciones"
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Instituciones
            </Link>
            <Link
              href="/mejores/tarjetas-de-credito"
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Mejores 2026
            </Link>
            <Link
              href="/quejas"
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Quejas
            </Link>
            <Link
              href="/evaluar"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              Evaluar
            </Link>
          </div>

          {/* 移动端汉堡菜单按钮 */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                // 关闭图标（X）
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // 汉堡图标
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 - 根据状态显示/隐藏 */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/instituciones"
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-700 font-medium px-2 py-1"
              >
                Instituciones
              </Link>
              <Link
                href="/mejores/tarjetas-de-credito"
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-700 font-medium px-2 py-1"
              >
                Mejores 2026
              </Link>
              <Link
                href="/quejas"
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-700 font-medium px-2 py-1"
              >
                Quejas
              </Link>
              <Link
                href="/evaluar"
                onClick={closeMenu}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-800 transition-colors font-medium"
              >
                Evaluar
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

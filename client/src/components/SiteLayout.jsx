import Header from './Header'
import Footer from './Footer'

export default function SiteLayout({ children }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-gradient-to-br from-night via-[#140f3d] to-[#2a1070]">
      {/* Resplandor decorativo */}
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />

      <Header />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 sm:px-8">
        {children}
      </div>

      <Footer />
    </div>
  )
}
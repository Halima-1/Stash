import TopNav from '../ui/topnav'
import Sidebar from '../ui/sidenav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-shell">
      <TopNav />
      <section className="dashboard-layout">
        <Sidebar />
        <section className="dashboard-main">{children}</section>
      </section>
    </div>
  )
}

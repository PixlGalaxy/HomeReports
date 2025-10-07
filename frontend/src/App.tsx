import { Outlet, Link, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function App() {
  const { pathname } = useLocation()
  return (
    <div className='min-h-dvh flex flex-col bg-slate-50 text-slate-900'>
      <Navbar />
      <main className='container mx-auto max-w-4xl w-full px-4 py-6'>
        <div className='mb-6 text-sm text-slate-500'>
          <Link className='link' to='/reports'>Reports</Link>
          <span className='mx-2'>/</span>
          {pathname.startsWith('/createreport') ? 'Create' : pathname.startsWith('/reports/') ? 'Detail' : 'List'}
        </div>
        <Outlet />
      </main>
    </div>
  )
}

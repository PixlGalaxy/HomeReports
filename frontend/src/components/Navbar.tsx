import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const item = (to: string, label: string) => (
    <NavLink
      to={to}
      className={({isActive}) =>
        `px-3 py-2 rounded-xl ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-200'}`
      }
    >
      {label}
    </NavLink>
  )
  return (
    <header className='border-b border-slate-200 bg-white'>
      <div className='container mx-auto max-w-4xl w-full px-4 py-3 flex items-center justify-between'>
        <Link to='/' className='font-semibold'>House Reports</Link>
        <nav className='flex gap-2'>
          {item('/reports','Reports')}
          {item('/createreport','Create')}
        </nav>
      </div>
    </header>
  )
}

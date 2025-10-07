import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { listReports, type Report } from '../lib/api'
import { Link } from 'react-router-dom'
import { connect } from '../lib/ws'

export default function Reports(){
  const [reports, setReports] = useState<Report[] | null>(null)

  async function load(){ setReports(await listReports()) }

  useEffect(()=>{
    load()
    const ws = connect((msg)=>{
      if (msg?.type === 'new_report'){
        setReports(prev => prev ? [msg.report, ...prev] : [msg.report])
      }
    })
    return ()=> ws.close()
  },[])

  if (!reports) return <Card>Loading…</Card>
  if (!reports.length) return <Card>No reports yet.</Card>

  return (
    <div className='space-y-3'>
      {reports.map(r=> (
        <Card key={r.id}>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <Link className='link text-lg font-semibold' to={`/reports/${r.id}`}>{r.subject}</Link>
              <div className='text-sm text-slate-500 mt-1'>
                By {r.reporter} · {new Date(r.created_at).toLocaleString()}
              </div>
              <p className='mt-2 line-clamp-2 text-slate-700'>{r.details_formal}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

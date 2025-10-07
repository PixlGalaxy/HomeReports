import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { useParams } from 'react-router-dom'
import { getReport, type Report } from '../lib/api'

export default function ReportDetail(){
  const { id } = useParams()
  const [report, setReport] = useState<Report | null>(null)

  useEffect(()=>{
    if (id) getReport(id).then(setReport).catch(()=> setReport(null))
  },[id])

  if (!report) return <Card>Loading…</Card>

  return (
    <div className='space-y-4'>
      <Card>
        <h1 className='text-xl font-semibold'>{report.subject}</h1>
        <div className='text-sm text-slate-500 mt-1'>
          By {report.reporter} · {new Date(report.created_at).toLocaleString()}
        </div>

        <div className='mt-4'>
          <h2 className='text-sm font-semibold text-slate-600'>Formalized</h2>
          <p className='mt-1 whitespace-pre-wrap'>{report.details_formal}</p>
        </div>

        <details className='mt-4'>
          <summary className='cursor-pointer text-sm text-slate-600'>Original text</summary>
          <pre className='mt-2 text-sm whitespace-pre-wrap'>{report.details_raw}</pre>
        </details>
      </Card>

      {!!report.images?.length && (
        <Card>
          <h3 className='text-sm font-semibold text-slate-600 mb-3'>Images</h3>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
            {report.images.map((src,i)=> (
              <a key={i} href={src} target='_blank' rel='noreferrer'>
                <img src={src} className='w-full h-44 object-cover rounded-xl border border-slate-200' />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

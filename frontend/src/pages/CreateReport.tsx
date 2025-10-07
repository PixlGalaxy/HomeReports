import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { createReport, getResidents } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function CreateReport(){
  const [residents, setResidents] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<FileList | null>(null)
  const nav = useNavigate()

  useEffect(()=>{
    getResidents().then(setResidents).finally(()=>setLoading(false))
  },[])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const target = e.currentTarget as HTMLFormElement
    const form = new FormData(target)

    // append images properly (multiple)
    if (files && files.length){
      for (const f of Array.from(files)) form.append('images', f)
    }

    const res = await createReport(form)
    nav(`/reports/${res.report.id}`)
  }

  if (loading) return <Card>Loading…</Card>

  return (
    <Card>
      <h1 className='text-xl font-semibold mb-4'>Create Report</h1>
      <form className='space-y-4' onSubmit={onSubmit}>
        <div>
          <label className='label'>Reporter</label>
          <select name='reporter' className='input'>
            {residents.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className='label'>Subject</label>
          <input name='subject' className='input' placeholder='Brief subject' required />
        </div>
        <div>
          <label className='label'>Details</label>
          <textarea name='details' className='input h-36' placeholder='Describe what happened…' required />
        </div>
        <div>
          <label className='label'>Images (optional)</label>
          <input
            type='file'
            multiple accept='image/*'
            className='input'
            onChange={(e)=> setFiles(e.target.files)}
          />
          <p className='text-xs text-slate-500 mt-1'>Images are stored and shown in detail view; AI model won’t see them.</p>
        </div>
        <div className='pt-2'>
          <button className='btn btn-primary'>Submit</button>
        </div>
      </form>
    </Card>
  )
}

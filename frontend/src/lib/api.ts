const HTTP = import.meta.env.VITE_BACKEND_HTTP || 'http://localhost:8000'

export type Report = {
  id: string
  reporter: string
  subject: string
  details_raw: string
  details_formal: string
  images: string[]
  created_at: string
}

export async function listReports(): Promise<Report[]> {
  const r = await fetch(`${HTTP}/api/reports`)
  const j = await r.json()
  return j.reports
}

export async function getReport(id: string): Promise<Report> {
  const r = await fetch(`${HTTP}/api/reports/${id}`)
  if (!r.ok) throw new Error('Not found')
  return r.json()
}

export async function getResidents(): Promise<string[]> {
  const r = await fetch(`${HTTP}/api/residents`);
  const j = await r.json();
  console.log("Residents response:", j); 
  return j.residents;
}


export async function createReport(form: FormData) {
  const r = await fetch(`${HTTP}/api/reports`, { method: 'POST', body: form })
  if (!r.ok) throw new Error('Failed to create report')
  return r.json()
}

const WS_URL = import.meta.env.VITE_BACKEND_WS || 'ws://localhost:8000'

export function connect(onMessage: (msg:any)=>void) {
  const ws = new WebSocket(`${WS_URL}/ws`)

  ws.onmessage = (ev) => {
    try { onMessage(JSON.parse(ev.data)) } catch { /* ignore */ }
  }

  const ping = setInterval(() => {
    if (ws.readyState === 1) ws.send('ping')
  }, 25000)

  ws.onclose = () => clearInterval(ping)
  return ws
}

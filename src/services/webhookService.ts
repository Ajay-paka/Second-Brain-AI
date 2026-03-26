/// <reference types="vite/client" />

const WEBHOOK_TIMEOUT_MS = 30000

function getWebhookUrl() {
  return import.meta.env.VITE_N8N_WEBHOOK_URL?.trim()
}

async function safeParseJson(response: Response) {
  try {
    const text = await response.text()
    return text ? JSON.parse(text) : {}
  } catch (e) {
    console.error('Failed to parse webhook response as JSON:', e)
    return {}
  }
}

async function callWebhook(payload: any) {
  const url = getWebhookUrl()
  if (!url) throw new Error('Missing VITE_N8N_WEBHOOK_URL')

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) throw new Error(`Webhook error: ${response.statusText}`)
    return await safeParseJson(response)
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function loadNotes() {
  return await callWebhook({ action: 'load' })
}

export async function addNote(payload: { title: string; content: string; category?: string; keywords?: string }) {
  return await callWebhook({ ...payload, action: 'add' })
}

export async function editNote(payload: { id: string; title: string; content: string; category?: string; keywords?: string }) {
  return await callWebhook({ ...payload, action: 'edit' })
}

export async function deleteNote(id: string) {
  return await callWebhook({ id, action: 'delete' })
}

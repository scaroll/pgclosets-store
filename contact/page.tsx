import ContactClientPage from "./ContactClientPage"
import { get } from '@vercel/edge-config'

export const metadata = {
  title: "Contact Us - Request Work",
  description: "Submit a work request or contact us directly for your project needs.",
}

export default async function Contact() {
  let contactEmbedEnabled = true
  try {
    const flag = await get<boolean>('contactEmbedEnabled')
    if (typeof flag === 'boolean') contactEmbedEnabled = flag
  } catch {}
  return <ContactClientPage contactEmbedEnabled={contactEmbedEnabled} />
}

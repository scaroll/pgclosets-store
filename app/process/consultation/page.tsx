import { redirect } from 'next/navigation'

// Redirect to main services consultation page
export default function ProcessConsultationPage() {
  redirect('/services/consultation')
}

import { BookingForm } from '@/components/booking/BookingForm'

export default function BookPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Book a Consultation</h1>
      <div className="mx-auto max-w-4xl">
        <BookingForm />
      </div>
    </div>
  )
}

import type { Metadata } from "next";
import StandardLayout from "@/components/layout/StandardLayout";
import { BookMeasureForm } from "@/components/booking/BookMeasureForm";

export const metadata: Metadata = {
  title: "Book In-Home Measure | PG Closets Ottawa",
  description: "Book your free in-home measure for custom closet doors. We measure precisely, confirm finishes, and schedule install. Serving Ottawa and surrounding areas.",
};

export default function BookMeasurePage() {
  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Book Your In-Home Measure</h1>
            <p className="text-xl text-muted-foreground">
              We measure precisely, confirm finishes, and schedule install.
            </p>
          </div>

          <BookMeasureForm />
        </div>
      </div>
    </StandardLayout>
  );
}

import { Metadata } from "next";
import StandardLayout from "@/components/layout/StandardLayout";
import { InstantEstimateStandalone } from "@/components/configurator/InstantEstimateStandalone";

export const metadata: Metadata = {
  title: "Instant Estimate | PG Closets Ottawa",
  description: "Get an instant price estimate for your custom closet doors. Configure dimensions, panels, and finishes to see installed pricing in seconds.",
};

export default function InstantEstimatePage() {
  return (
    <StandardLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Instant Estimate</h1>
            <p className="text-xl text-muted-foreground">
              Configure your door and see installed pricing in seconds.
              Rough measurements are fine — we'll verify on site.
            </p>
          </div>

          <InstantEstimateStandalone />
        </div>
      </div>
    </StandardLayout>
  );
}

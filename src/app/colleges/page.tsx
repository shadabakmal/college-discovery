import { Suspense } from "react";
import CollegesClientPage from "@/components/CollegesClientPage";

export const dynamic = "force-dynamic";

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading colleges...</div>}>
      <CollegesClientPage />
    </Suspense>
  );
}

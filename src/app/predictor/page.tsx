import { Suspense } from "react";
import PredictorClientPage from "@/components/PredictorClientPage";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function PredictorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>}>
      <PredictorClientPage />
    </Suspense>
  );
}

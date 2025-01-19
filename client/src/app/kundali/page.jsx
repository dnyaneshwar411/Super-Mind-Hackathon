"use client";
import KundaliForm from "@/components/pages/KundaliForm";
import NavamsaChart from "@/components/pages/NavsamaChart";
import useKundaliContext from "@/contexts/KundaliContext";

export default function KundaliPage() {
  const { data: {
    navasmaChart = [],
    planetsChart = []
  } } = useKundaliContext();
  if (!planetsChart || !navasmaChart) return <div>
    <KundaliForm />
  </div>

  return (
    <div className="flex items-center justify-center">
      <NavamsaChart data={navasmaChart} />
      <NavamsaChart data={planetsChart} />
    </div>
  )
}
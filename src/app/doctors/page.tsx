import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DoctorsPageContent } from "@/components/doctors/DoctorsPageContent";
import type { Doctor } from "@/types/database";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Наши врачи — Rcheuli Medical Center",
};

export default async function DoctorsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("doctors")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  const doctors = (data as Doctor[] | null) ?? [];

  return (
    <>
      <Header />
      <main className="flex-1">
        <DoctorsPageContent doctors={doctors} />
      </main>
      <Footer />
    </>
  );
}

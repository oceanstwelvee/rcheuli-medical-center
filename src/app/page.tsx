import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Doctors } from "@/components/site/Doctors";
import { Contacts } from "@/components/site/Contacts";
import { Footer } from "@/components/site/Footer";
import type { Doctor, SiteContent } from "@/types/database";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const [aboutRes, doctorsRes] = await Promise.all([
    supabase.from("site_content").select("*").eq("key", "about_us").maybeSingle(),
    supabase
      .from("doctors")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const about = (aboutRes.data as SiteContent | null) ?? null;
  const doctors = (doctorsRes.data as Doctor[] | null) ?? [];

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About content={about} />
        <Doctors doctors={doctors} />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}

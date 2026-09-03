import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Doctors } from "@/components/site/Doctors";
import { Contacts } from "@/components/site/Contacts";
import { Footer } from "@/components/site/Footer";
import type { Doctor, Service, ServiceCategory, SiteContent } from "@/types/database";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const [aboutRes, categoriesRes, servicesRes, doctorsRes] = await Promise.all([
    supabase.from("site_content").select("*").eq("key", "about_us").maybeSingle(),
    supabase.from("service_categories").select("*").order("sort_order"),
    supabase.from("services").select("*").order("sort_order"),
    supabase
      .from("doctors")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const about = (aboutRes.data as SiteContent | null) ?? null;
  const categories = (categoriesRes.data as ServiceCategory[] | null) ?? [];
  const services = (servicesRes.data as Service[] | null) ?? [];
  const doctors = (doctorsRes.data as Doctor[] | null) ?? [];

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About content={about} />
        <Services categories={categories} services={services} />
        <Doctors doctors={doctors} />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}

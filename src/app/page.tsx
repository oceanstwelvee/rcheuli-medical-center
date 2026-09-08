import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Promotions } from "@/components/site/Promotions";
import { ServicesPreview } from "@/components/site/ServicesPreview";
import { DoctorsPreview } from "@/components/site/DoctorsPreview";
import { Contacts } from "@/components/site/Contacts";
import { Footer } from "@/components/site/Footer";
import type {
  Doctor,
  Promotion,
  Service,
  ServiceCategory,
  SiteContent,
} from "@/types/database";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const [aboutRes, promotionsRes, categoriesRes, servicesRes, doctorsRes] =
    await Promise.all([
      supabase.from("site_content").select("*").eq("key", "about_us").maybeSingle(),
      supabase
        .from("promotions")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
      supabase.from("service_categories").select("*").order("sort_order"),
      supabase.from("services").select("*").order("sort_order"),
      supabase
        .from("doctors")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
    ]);

  const about = (aboutRes.data as SiteContent | null) ?? null;
  const promotions = (promotionsRes.data as Promotion[] | null) ?? [];
  const categories = (categoriesRes.data as ServiceCategory[] | null) ?? [];
  const services = (servicesRes.data as Service[] | null) ?? [];
  const doctors = (doctorsRes.data as Doctor[] | null) ?? [];

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About content={about} />
        <Promotions promotions={promotions} />
        <ServicesPreview services={services} categories={categories} />
        <DoctorsPreview doctors={doctors} />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}

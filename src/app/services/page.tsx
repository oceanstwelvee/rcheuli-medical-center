import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ServicesPageContent } from "@/components/services/ServicesPageContent";
import type { Service, ServiceCategory } from "@/types/database";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Услуги и цены — Rcheuli Medical Center",
};

export default async function ServicesPage() {
  const supabase = await createClient();

  const [categoriesRes, servicesRes] = await Promise.all([
    supabase.from("service_categories").select("*").order("sort_order"),
    supabase.from("services").select("*").order("sort_order"),
  ]);

  const categories = (categoriesRes.data as ServiceCategory[] | null) ?? [];
  const services = (servicesRes.data as Service[] | null) ?? [];

  return (
    <>
      <Header />
      <main className="flex-1">
        <ServicesPageContent categories={categories} services={services} />
      </main>
      <Footer />
    </>
  );
}

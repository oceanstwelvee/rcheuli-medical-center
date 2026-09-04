import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Contacts } from "@/components/site/Contacts";
import { Footer } from "@/components/site/Footer";
import type { SiteContent } from "@/types/database";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const aboutRes = await supabase
    .from("site_content")
    .select("*")
    .eq("key", "about_us")
    .maybeSingle();

  const about = (aboutRes.data as SiteContent | null) ?? null;

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About content={about} />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}

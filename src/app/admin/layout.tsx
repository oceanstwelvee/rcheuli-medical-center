import { AdminLanguageProvider } from "@/lib/i18n/AdminLanguageContext";

/**
 * Wraps the whole panel, login page included, so the language picked on the
 * login screen is already in force once the editor is inside.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLanguageProvider>{children}</AdminLanguageProvider>;
}

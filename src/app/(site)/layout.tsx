import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface SiteLayoutProps {
  children: React.ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

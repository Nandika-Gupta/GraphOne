import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main style={{ minHeight: "calc(100vh - 60px)" }}>{children}</main>
      <Footer />
    </>
  );
}

import { InvestorProfile } from "@/components/pages/InvestorProfile";

export default function InvestorPage({ params }: { params: { slug: string } }) {
  return <InvestorProfile slug={params.slug} />;
}

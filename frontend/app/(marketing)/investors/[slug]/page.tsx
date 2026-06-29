import { InvestorProfile } from "@/components/pages/InvestorProfile";
import { getInvestor } from "@/lib/api";
import { GODATA } from "@/lib/data";

export default async function InvestorPage({ params }: { params: { slug: string } }) {
  const apiInvestor = await getInvestor(params.slug);
  const investor = apiInvestor ?? GODATA.investorBySlug[params.slug] ?? GODATA.investors[0]!;
  return <InvestorProfile slug={params.slug} investor={investor} />;
}

import { CompanyProfile } from "@/components/pages/CompanyProfile";
import { getCompany } from "@/lib/api";
import { GODATA } from "@/lib/data";

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const apiCompany = await getCompany(params.slug);
  const company = apiCompany ?? GODATA.companyBySlug[params.slug] ?? GODATA.companies[0]!;
  return <CompanyProfile slug={params.slug} company={company} />;
}

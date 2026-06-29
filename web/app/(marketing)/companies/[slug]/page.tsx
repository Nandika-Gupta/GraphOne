import { CompanyProfile } from "@/components/pages/CompanyProfile";

export default function CompanyPage({ params }: { params: { slug: string } }) {
  return <CompanyProfile slug={params.slug} />;
}

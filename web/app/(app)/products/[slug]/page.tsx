import { ProductDetail } from "@/components/pages/ProductDetail";

export default function AppProductDetailPage({ params }: { params: { slug: string } }) {
  return <ProductDetail slug={params.slug} />;
}

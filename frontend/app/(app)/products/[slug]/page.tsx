import { ProductDetail } from "@/components/pages/ProductDetail";
import { getProduct } from "@/lib/api";
import { GODATA } from "@/lib/data";

export default async function AppProductDetailPage({ params }: { params: { slug: string } }) {
  const apiProduct = await getProduct(params.slug);
  const product = apiProduct ?? GODATA.productBySlug[params.slug] ?? GODATA.products[0]!;
  return <ProductDetail slug={params.slug} product={product} />;
}

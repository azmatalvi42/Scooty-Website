import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import { SiteImage } from '../components/ui/SiteImage';
import { RidersAnimation } from '../components/ui/RidersAnimation';

export function ProductPage() {
  const { productSlug } = useParams();
  const product = products.find(item => item.slug === productSlug);
  if (!product) return <section className="max-w-7xl mx-auto px-6 py-24"><h1 className="font-display text-4xl mb-6">Product not found</h1><Link to="/" className="underline">Back to SCOOTY</Link></section>;

  return (
    <article className="product-page max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
      <Link to="/#services" className="inline-flex items-center gap-2 text-sm mb-10"><ArrowLeft size={16} /> All solutions</Link>
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="inline-block px-4 py-2 rounded-full text-xs font-bold text-black mb-6" style={{ background: product.accent }}>{product.title}</p>
          <h1 className="font-display text-5xl sm:text-6xl mb-6">{product.headline}</h1>
          <p className="text-lg leading-relaxed text-gray-500 mb-8 max-w-xl">{product.description}</p>
          <Link to={product.href} className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-black font-semibold" style={{ background: product.accent }}>{product.cta}<ArrowRight size={18} /></Link>
        </div>
        {product.slug === 'micromobility' ? <RidersAnimation /> : <div className="overflow-hidden rounded-3xl bg-[#172720]"><SiteImage src={product.image} alt={product.alt} loading="eager" className="w-full aspect-[4/3] object-contain" /></div>}
      </div>
      {product.features.length > 0 && <section className="py-16 sm:py-24">
        <h2 className="font-display mb-6">{product.sectionTitle}</h2>
        <p className="max-w-3xl text-lg leading-relaxed text-gray-500 mb-10">{product.introduction}</p>
        <div className="grid md:grid-cols-3 gap-5">{product.features.map((feature, index) => <div key={feature.title} className="product-feature p-7 rounded-2xl border border-[var(--editorial-border)]">
          <span className="text-sm font-semibold text-gray-500">0{index + 1}</span>
          <h3 className="text-2xl mt-6 mb-3">{feature.title}</h3><p className="text-gray-500 leading-relaxed">{feature.text}</p>
        </div>)}</div>
      </section>}
      {product.steps.length > 0 && <section className="border-t border-[var(--editorial-border)] py-12 grid md:grid-cols-2 gap-8">
        <h2 className="font-display">{product.workflowTitle}</h2>
        <ol className="space-y-6">{product.steps.map((step, index) => <li key={step} className="flex gap-4 items-start"><span className="flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-black text-sm font-bold" style={{ background: product.accent }}>{index + 1}</span><p className="pt-1 text-gray-500">{step}</p></li>)}</ol>
      </section>}
      <nav aria-label="Other products" className="mt-12 border-t border-[var(--editorial-border)] pt-8">
        <p className="text-sm text-gray-500 mb-4">Explore the SCOOTY product family</p>
        <div className="flex flex-wrap gap-3">{products.filter(item => item.slug !== product.slug).map(item => <Link key={item.slug} to={`/products/${item.slug}`} className="inline-flex items-center gap-3 rounded-full border border-[var(--editorial-border)] px-5 py-3 hover:bg-black/5 dark:hover:bg-white/5">{item.tag}<ArrowRight size={16} /></Link>)}</div>
      </nav>
    </article>
  );
}

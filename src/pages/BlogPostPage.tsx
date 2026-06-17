import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Clock, Calendar, Lightbulb } from 'lucide-react';
import { POSTS, CATEGORY_ACCENT, type ArticleBlock } from '../data/blog';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Body block renderer ──────────────────────────────────────────────── */

const Block = ({ block, accent }: { block: ArticleBlock; accent: string }) => {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="mb-3 mt-10 font-masthead text-xl font-black tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {block.text}
        </h2>
      );

    case 'paragraph':
      return (
        <p className="mt-4 font-news text-[15px] leading-relaxed text-gray-700 dark:text-white/70 sm:text-[17px] sm:leading-relaxed">
          {block.text}
        </p>
      );

    case 'tip':
      return (
        <div className="my-6 flex gap-3 rounded-2xl border border-[#FEC001]/30 bg-[#FEC001]/[0.08] px-4 py-4">
          <Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#B88400] dark:text-[#FEC001]" />
          <p className="font-news text-sm font-medium leading-relaxed text-gray-800 dark:text-white/85">
            {block.text}
          </p>
        </div>
      );

    case 'list': {
      const items = block.items ?? [];
      if (block.ordered) {
        return (
          <ol className="mt-4 space-y-3">
            {items.map((it, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FEC001] text-xs font-bold text-black">
                  {i + 1}
                </span>
                <span className="font-news text-[15px] leading-relaxed text-gray-700 dark:text-white/70 sm:text-base">
                  {it}
                </span>
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="mt-4 space-y-2.5">
          {items.map((it, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <span className="font-news text-[15px] leading-relaxed text-gray-700 dark:text-white/70 sm:text-base">
                {it}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    default:
      return null;
  }
};

/* ─── Page ─────────────────────────────────────────────────────────────── */

export const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const reduce = !!useReducedMotion();
  const post = POSTS.find((p) => p.id === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20 dark:bg-black">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-masthead text-3xl font-black text-gray-900 dark:text-white">Article not found</h1>
          <p className="mt-3 text-gray-600 dark:text-white/60">
            This story may have moved or doesn’t exist yet.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 text-[#B88400] hover:underline dark:text-[#FEC001]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the Blog
          </Link>
        </div>
      </div>
    );
  }

  const accent = CATEGORY_ACCENT[post.category] ?? '#FEC001';
  const initials = (
    post.author.includes(' ')
      ? post.author.split(' ').map((w) => w[0]).join('')
      : post.author.slice(0, 2)
  )
    .slice(0, 2)
    .toUpperCase();
  const related = POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[46vh] max-w-3xl flex-col justify-end px-4 pb-10 pt-28 sm:min-h-[52vh] sm:px-6 sm:pb-12 lg:px-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Link
              to="/blog"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the Blog
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 py-1 pl-2 pr-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md"
                style={{ borderLeftWidth: 2, borderLeftColor: accent }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                {post.category}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                {post.stop}
              </span>
            </div>

            <h1 className="mt-4 font-masthead text-3xl font-black leading-[1.03] tracking-tight text-white sm:text-4xl lg:text-[2.9rem]">
              {post.title}
            </h1>
            <p className="mt-3 max-w-2xl font-news text-base italic leading-relaxed text-white/75 sm:text-lg">
              {post.excerpt}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold text-white/70">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 place-items-center rounded-full bg-[#FEC001] text-[9px] font-bold text-black"
                >
                  {initials}
                </span>
                <span className="text-white/85">{post.author}</span>
              </span>
              <span className="hidden h-3 w-px bg-white/25 sm:block" />
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 text-[#FEC001]" />
                {post.date}
              </span>
              <span className="hidden h-3 w-px bg-white/25 sm:block" />
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#FEC001]" />
                {post.readTime}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Article body ── */}
      <section className="pb-16 pt-10 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          >
            {post.body.map((block, i) => (
              <Block key={i} block={block} accent={accent} />
            ))}
          </motion.article>

          {/* divider */}
          <div className="mt-12 border-t border-gray-200 dark:border-white/10" />

          {/* CTA */}
          <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-masthead text-xl font-black text-gray-900 dark:text-white">
                Ready to ride?
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-white/60">
                Your City, Your Ride. Download the SCOOTY app and unlock your first vehicle.
              </p>
            </div>
            <Link
              to="/riders"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-[#FEC001] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-[#FFD00F]"
            >
              Get started
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Keep reading ── */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-gray-50 py-14 dark:border-white/10 dark:bg-black">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#FEC001]" />
              <span className="font-news text-[11px] font-bold uppercase tracking-[0.3em] text-[#B88400] dark:text-[#FEC001]">
                Keep reading
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => {
                const a = CATEGORY_ACCENT[p.category] ?? '#FEC001';
                return (
                  <Link
                    key={p.id}
                    to={`/blog/${p.id}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-[#FEC001]/40 hover:shadow-lg dark:border-white/[0.07] dark:bg-[#0A0A0A]"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-white/55">
                        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: a }} />
                        {p.category}
                      </span>
                      <h3 className="mt-1.5 font-news text-base font-bold leading-snug text-gray-900 dark:text-white">
                        {p.title}
                      </h3>
                      <span className="mt-auto flex items-center gap-1 pt-3 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                        Read
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#FEC001] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;

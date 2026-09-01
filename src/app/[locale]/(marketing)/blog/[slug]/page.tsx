import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Clock, ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { data } from "@/lib/data";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo/alternates";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { lx } from "@/lib/i18n/lx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Blog category slug mapping — matches CATEGORY_MAP in the deleted [category]/page.tsx
const BLOG_CATEGORIES: Record<
  string,
  { en: string; tr: string; az: string; ru: string }
> = {
  admissions: {
    en: "Admissions",
    tr: "Başvuru",
    az: "Müraciət",
    ru: "Поступление",
  },
  education: { en: "Education", tr: "Eğitim", az: "Təhsil", ru: "Образование" },
  "cost-of-living": {
    en: "Cost of Living",
    tr: "Yaşam Maliyeti",
    az: "Ömür xərcləri",
    ru: "Расходы на жизнь",
  },
  "student-life": {
    en: "Student Life",
    tr: "Öğrenci Hayatı",
    az: "Tələbə Həyatı",
    ru: "Студенческая жизнь",
  },
  scholarships: {
    en: "Scholarships",
    tr: "Burslar",
    az: "Təqaüdlər",
    ru: "Стипендии",
  },
  "why-azerbaijan": {
    en: "Why Azerbaijan",
    tr: "Neden Azerbaycan",
    az: "Niyə Azərbaycan",
    ru: "Почему Азербайджан",
  },
  "travel-guide": {
    en: "Travel Guide",
    tr: "Gezi Rehberi",
    az: "Səyahət Bələdçisi",
    ru: "Путеводитель",
  },
  medicine: { en: "Medicine", tr: "Tıp", az: "Tibb", ru: "Медицина" },
  "study-abroad": {
    en: "Study Abroad",
    tr: "Yurtdışı Eğitim",
    az: "Xaricdə Təhsil",
    ru: "Обучение за рубежом",
  },
  culture: { en: "Culture", tr: "Kültür", az: "Mədəniyyət", ru: "Культура" },
  comparison: {
    en: "Comparison",
    tr: "Karşılaştırma",
    az: "Müqayisə",
    ru: "Сравнение",
  },
  "visa-guide": {
    en: "Visa Guide",
    tr: "Vize Rehberi",
    az: "Viza Bələdçisi",
    ru: "Визовое руководство",
  },
  engineering: {
    en: "Engineering",
    tr: "Mühendislik",
    az: "Mühəndislik",
    ru: "Инженерное дело",
  },
  universities: {
    en: "Universities",
    tr: "Üniversiteler",
    az: "Universitetlər",
    ru: "Университеты",
  },
};

// ISR — blog posts rarely change after publishing; rebuild hourly.
// SE-5/P2: pre-render all posts at build time — a small, static set that
// otherwise pays a cold SSR + DB round-trip on every first visit/crawl.
// PERF/Cache: blog posts are long-form and rarely change (seeded content, no
// admin edits) — a longer ISR window keeps them cached on the CDN longer,
// reducing origin round-trips. On-demand revalidation via redeploy still
// refreshes them instantly if content is ever edited.
export const revalidate = 21600;

export async function generateStaticParams() {
  const posts = await data.blog.list();
  // Include both blog post slugs and category slugs
  const postSlugs = posts.map((post) => post.slug);
  const categorySlugs = Object.keys(BLOG_CATEGORIES);
  const allSlugs = [...new Set([...postSlugs, ...categorySlugs])];
  return routing.locales.flatMap((locale) =>
    allSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Check if slug is a category
  const catInfo = BLOG_CATEGORIES[slug];
  if (catInfo) {
    const catName = catInfo.en ?? slug;
    return buildPageMetadata({
      locale,
      path: `/blog/${slug}`,
      title: `${catName} — Study in Azerbaijan | AzStudy`,
      description: `Browse all ${catName.toLowerCase()} articles about studying in Azerbaijan: guides, tips and resources for international students.`,
    });
  }

  const post = await data.blog.getBySlug(slug);
  if (!post) return {};
  const t = await getTranslations({ locale, namespace: "Blog" });
  return buildPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: t("metaDetailTitle", { title: lx(post.title, locale) }),
    description: lx(post.excerpt, locale),
    image: post.coverImage,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const appLocale = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "Blog" });

  // Check if slug is a category — render category page instead
  const catInfo = BLOG_CATEGORIES[slug];
  if (catInfo) {
    const catName = catInfo.en ?? slug;
    const allPosts = await data.blog.list();
    const posts = allPosts.filter((p) => {
      const postCatSlug = p.category.en
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      return postCatSlug === slug;
    });
    const isThin = posts.length < 2;

    return (
      <>
        {isThin && (
          <head>
            <meta name="robots" content="noindex, follow" />
            <link rel="canonical" href={`${siteConfig.url}/en/blog/${slug}`} />
          </head>
        )}
        <div className="container-page py-section-md">
          <JsonLd
            data={collectionPageJsonLd(
              `${catName} — AzStudy Blog`,
              `${siteConfig.url}/${locale}/blog/${slug}`,
              posts.map((p) => ({
                name: lx(p.title, appLocale),
                url: `${siteConfig.url}/${locale}/blog/${p.slug}`,
              })),
            )}
          />
          <header className="mb-10">
            <nav className="mb-4 text-sm text-muted-foreground">
              <Link href="/blog" className="hover:text-primary">
                {t("title")}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">{catName}</span>
            </nav>
            <h1 className="font-display text-headline-xl text-foreground">
              {catName}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {t("categoryDescription", { category: catName.toLowerCase() })}
            </p>
          </header>
          {posts.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <p>{t("noPosts")}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-flat-hover">
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface-low">
                      <Image
                        src={post.coverImage}
                        alt={lx(post.title, appLocale)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="space-y-3 p-5">
                      <Badge variant="tertiary">
                        {lx(post.category, appLocale)}
                      </Badge>
                      <h2 className="font-display text-lg font-semibold leading-snug text-foreground">
                        {lx(post.title, appLocale)}
                      </h2>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {lx(post.excerpt, appLocale)}
                      </p>
                      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {t("minRead", { min: post.readingMinutes })}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          {t("readMore")}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  const post = await data.blog.getBySlug(slug);
  if (!post) notFound();

  const path = `/blog/${slug}`;

  // AEO thin-content protection: if content in this locale is < 200 chars,
  // tell search engines not to index this locale variant.
  const content = lx(post.content, appLocale);
  const isThinLocale = content.length < 200;

  // Get related posts (same category, excluding current)
  const allPosts = await data.blog.list();
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category.en === post.category.en)
    .slice(0, 3);

  return (
    <>
      {isThinLocale && (
        <head>
          <meta name="robots" content="noindex, follow" />
          <link
            rel="canonical"
            href={`${siteConfig.url}/en/blog/${post.slug}`}
          />
        </head>
      )}
      <article>
        <JsonLd
          data={[
            articleJsonLd(post, appLocale),
            breadcrumbJsonLd([
              { name: t("home"), url: `${siteConfig.url}/${locale}` },
              { name: t("blog"), url: `${siteConfig.url}/${locale}/blog` },
              {
                name: lx(post.title, appLocale),
                url: `${siteConfig.url}/${locale}${path}`,
              },
            ]),
            ...(post.faqs?.length
              ? [
                  faqPageJsonLd(
                    post.faqs.map((f, i) => ({
                      id: `${post.slug}-faq-${i}`,
                      entityType: "general" as const,
                      entityId: post.id,
                      question: f.qI18n ?? { en: f.q },
                      answer: f.aI18n ?? { en: f.a },
                    })),
                    appLocale,
                    `${siteConfig.url}/${locale}${path}`,
                  ),
                ]
              : []),
          ]}
        />

        <div className="container-page max-w-3xl py-section-md">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Link>

          <div className="mt-6">
            <Badge variant="tertiary">{lx(post.category, appLocale)}</Badge>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {lx(post.title, appLocale)}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{post.author}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {/* Freshness signal (AEO): surface when the post was revised after
                publishing — AI systems and Google both weight recency. */}
              {post.updatedAt &&
                new Date(post.updatedAt).getTime() !==
                  new Date(post.publishedAt).getTime() && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {t("lastUpdated")}:{" "}
                    {new Date(post.updatedAt).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t("minRead", { min: post.readingMinutes })}
              </span>
            </div>
          </div>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg border border-border">
            <Image
              src={post.coverImage}
              alt={lx(post.title, appLocale)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <div className="prose prose-lg mt-8 max-w-none prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg">
            <RichContent content={content} />
          </div>

          {/* Author Bio - AEO trust signal */}
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-sm text-muted-foreground">
                  {t("authorBio")}
                </p>
              </div>
            </div>
          </div>

          {/* Related Posts - Internal linking for SEO */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                {t("relatedPosts")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group block rounded-lg border border-border p-4 hover:shadow-flat-hover transition-shadow"
                  >
                    <Badge variant="tertiary" className="mb-2">
                      {lx(related.category, appLocale)}
                    </Badge>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {lx(related.title, appLocale)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {lx(related.excerpt, appLocale)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section — AEO: visible FAQ blocks increase AI citation rate */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                {t("faqTitle")}
              </h2>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-lg border border-border p-4"
                  >
                    <summary className="cursor-pointer font-semibold text-foreground">
                      {faq.qI18n ? lx(faq.qI18n, appLocale) : faq.q}
                    </summary>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {faq.aI18n ? lx(faq.aI18n, appLocale) : faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 rounded-lg border border-primary-container bg-surface-low p-6 text-center">
            <p className="font-display text-lg font-semibold text-foreground">
              {t("ctaTitle")}
            </p>
            <Button asChild variant="cta" className="mt-4">
              <Link href="/apply">{t("ctaButton")}</Link>
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}

/**
 * Lightweight blog content renderer.
 *
 * Supports the content format used in the seed: plain paragraphs separated by
 * blank lines, `## ` / `### ` headings, `- ` bullet lists, and inline
 * `[text](/path)` links (rendered as internal `Link`s).
 */
function RichContent({ content }: { content: string }) {
  const blocks = content.split("\n");
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!list.length) return;
    out.push(
      <ul key={key++} className="my-4 list-disc space-y-1 pl-6 text-foreground">
        {list.map((item, i) => (
          <li key={i} className="leading-relaxed">
            <InlineContent text={item} />
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const raw of blocks) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      out.push(
        <h2
          key={key++}
          className="mt-8 mb-3 font-display text-headline-md font-semibold text-foreground"
        >
          <InlineContent text={line.slice(3)} />
        </h2>,
      );
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      out.push(
        <h3
          key={key++}
          className="mt-6 mb-2 font-display text-lg font-semibold text-foreground"
        >
          <InlineContent text={line.slice(4)} />
        </h3>,
      );
      continue;
    }
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }
    flushList();
    out.push(
      <p key={key++} className="mb-4 leading-relaxed text-foreground">
        <InlineContent text={line} />
      </p>,
    );
  }
  flushList();

  return <>{out}</>;
}

/** Renders inline `[text](/path)` links inside a plain-text run. */
function InlineContent({ text }: { text: string }) {
  const segments = text.split(/\[([^\]]+)\]\(([^)]+)\)/);
  return (
    <>
      {segments.map((part, j) => {
        if (j % 3 === 1) {
          return (
            <Link
              key={j}
              href={segments[j + 1]}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              {part}
            </Link>
          );
        }
        if (j % 3 === 2) return null;
        return <span key={j}>{part}</span>;
      })}
    </>
  );
}

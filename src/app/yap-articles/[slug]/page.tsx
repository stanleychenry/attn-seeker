import Link from "next/link";
import Image from "next/image";
import {
  getYapArticleBySlug,
  getTopicById,
  getTeamById,
  getArticlesByTopicId,
} from "@/lib/cms";
import type { Topic } from "@/types/cms";
import { notFound } from "next/navigation";
import {
  Heading,
  Body,
  Section,
  Container,
} from "@/components/ui";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type PageParams = { params: { slug: string } };

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const article = await getYapArticleBySlug(params.slug);
    if (!article) return { title: "article not found | attn:seeker" };
    const metaTitle =
      (article as { metaTitle?: string }).metaTitle ??
      (article as { seoTitle?: string }).seoTitle ??
      (article as { seoMetaTitle?: string }).seoMetaTitle ??
      article.name;
    const metaDesc =
      (article as { metaDescription?: string }).metaDescription ??
      (article as { seoDescription?: string }).seoDescription ??
      (article as { seoMetaDescription?: string }).seoMetaDescription ??
      (article as { summary?: string }).summary ??
      article.summary ??
      "";
    return {
      title: `${metaTitle} | attn:seeker`,
      description: metaDesc,
    };
  } catch {
    return { title: "article not found | attn:seeker" };
  }
}

export default async function ArticleDetailPage({ params }: PageParams) {
  let article: Awaited<ReturnType<typeof getYapArticleBySlug>> = null;
  try {
    article = await getYapArticleBySlug(params.slug);
  } catch (error) {
    console.error("Failed to fetch article:", error);
    notFound();
  }
  if (!article) notFound();

  const primaryTopicId =
    typeof article.primaryTopic === "string"
      ? article.primaryTopic
      : (article.primaryTopic as Topic)?.id;
  const [primaryTopic, authorMember, relatedRaw] = await Promise.all([
    primaryTopicId ? getTopicById(primaryTopicId) : Promise.resolve(null),
    typeof article.author === "string" ? getTeamById(article.author) : Promise.resolve(article.author ?? null),
    primaryTopicId
      ? getArticlesByTopicId(primaryTopicId).then((list) =>
          list.filter((a) => a.slug !== article!.slug).slice(0, 3)
        )
      : Promise.resolve([]),
  ]);

  const secondaryTopicRefs =
    (article as { secondaryTopics?: (Topic | string)[] }).secondaryTopics ?? [];
  const secondaryTopicIds = secondaryTopicRefs.map((t) =>
    typeof t === "string" ? t : (t as Topic).id
  );
  const secondaryTopics = await Promise.all(
    secondaryTopicIds.map((id) => getTopicById(id))
  ).then((arr) => arr.filter(Boolean)) as Topic[];

  const publishedAt =
    (article as { publishedAt?: string }).publishedAt ??
    article.publishedDate ??
    (article as { publishDate?: string }).publishDate;
  const readingTime =
    (article as { readingTime?: number }).readingTime ?? article.readingTime;
  const coverImage =
    (article as { coverImage?: string }).coverImage ?? article.thumbnailUrl;
  const bodyContent =
    article.body ?? (article as { content?: string }).content ?? "";
  const bodyIsHtml = bodyContent.includes("<");
  const originalUrl =
    (article as { originalUrl?: string }).originalUrl ??
    (article as { beehiivUrl?: string }).beehiivUrl;

  const displayAuthorName =
    (authorMember as { name?: string } | null)?.name ??
    (typeof article.author === "string" ? "" : (article.author as { name?: string })?.name) ??
    "attn:seeker";

  return (
    <>
      {/* 1. Article header */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="content">
          {primaryTopic && (
            <Link
              href={`/learn/${primaryTopic.slug}`}
              className="font-obviously text-xs font-medium uppercase tracking-wide text-red hover:underline"
            >
              {primaryTopic.name}
            </Link>
          )}
          <Heading level={1} className="mt-4">
            {article.name}
          </Heading>
          <p className="mt-4 font-obviously text-sm text-black/50">
            {authorMember ? (
              <Link
                href={`/agency/team/${(authorMember as { slug: string }).slug}`}
                className="hover:text-red hover:underline"
              >
                {displayAuthorName}
              </Link>
            ) : (
              displayAuthorName
            )}
            {publishedAt && ` · ${formatDate(publishedAt)}`}
            {readingTime != null && ` · ${readingTime} min read`}
          </p>
          {coverImage && (
            <div className="relative mt-8 aspect-video w-full overflow-hidden bg-black/5">
              <Image
                src={coverImage}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}
        </Container>
      </Section>

      {/* 2. Article body */}
      <Section background="bone" padding="none" className="py-8 md:py-16">
        <Container width="content">
          {bodyContent ? (
            bodyIsHtml ? (
              <div
                className="prose prose-lg max-w-none font-tiempos-text text-black/80 prose-headings:font-obviously-wide prose-headings:font-semibold prose-headings:text-black prose-headings:lowercase prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-xl prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-lg prose-p:mb-5 prose-p:leading-relaxed prose-a:text-red prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-red prose-blockquote:pl-6 prose-blockquote:font-tiempos-headline prose-blockquote:text-xl prose-blockquote:text-black/70 prose-blockquote:not-italic prose-strong:font-semibold prose-strong:text-black prose-li:marker:text-red"
                dangerouslySetInnerHTML={{
                  __html: bodyContent,
                }}
              />
            ) : (
              <Body className="text-black/80">{bodyContent}</Body>
            )
          ) : (
            <Body className="italic text-black/50">
              article content will appear here when connected to the CMS.
            </Body>
          )}
        </Container>
      </Section>

      {/* 3. Article footer */}
      <Section background="bone" padding="none" className="py-8">
        <Container width="content">
          <hr className="mb-8 border-black/10" />
          {(primaryTopic || secondaryTopics.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {primaryTopic && (
                <Link
                  href={`/learn/${primaryTopic.slug}`}
                  className="rounded-full bg-red/10 px-3 py-1 font-obviously text-xs font-medium text-red hover:bg-red/20"
                >
                  {primaryTopic.name}
                </Link>
              )}
              {secondaryTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/learn/${topic.slug}`}
                  className="rounded-full bg-black/5 px-3 py-1 font-obviously text-xs font-medium text-black/60 hover:bg-black/10"
                >
                  {topic.name}
                </Link>
              ))}
            </div>
          )}
          {displayAuthorName && (
            <div className="mt-8 flex items-center gap-4">
              {authorMember && (authorMember as { photoUrl?: string }).photoUrl && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-black/5">
                  <Image
                    src={(authorMember as { photoUrl?: string }).photoUrl ?? ""}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                {authorMember ? (
                  <Link
                    href={`/agency/team/${(authorMember as { slug: string }).slug}`}
                    className="font-obviously text-sm font-semibold text-black hover:text-red"
                  >
                    {(authorMember as { name: string }).name}
                  </Link>
                ) : (
                  <span className="font-obviously text-sm font-semibold text-black">
                    {displayAuthorName}
                  </span>
                )}
                {(authorMember as { role?: string })?.role && (
                  <p className="mt-0.5 font-obviously text-xs text-black/50">
                    {(authorMember as { role: string }).role}
                  </p>
                )}
              </div>
            </div>
          )}
          {originalUrl && (
            <p className="mt-6 font-obviously text-xs text-black/40">
              originally published in{" "}
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red hover:underline"
              >
                your attention please
              </a>
            </p>
          )}
        </Container>
      </Section>

      {/* 4. Related articles */}
      {relatedRaw.length > 0 && (
        <Section background="bone" padding="none" className="py-16">
          <Container width="standard">
            <Heading level={2}>keep reading</Heading>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3">
              {relatedRaw.map((rel, i) => (
                <Link
                  key={rel.id}
                  href={`/yap-articles/${rel.slug}`}
                  className={`group block py-4 md:px-6 md:py-0 ${
                    i > 0
                      ? "border-t border-black/10 md:border-t-0 md:border-l md:border-black/10"
                      : ""
                  } ${i === 0 ? "md:pl-0" : ""} ${
                    i === relatedRaw.length - 1 ? "md:pr-0" : ""
                  }`}
                >
                  <span className="font-obviously text-xs text-red">
                    {primaryTopic?.name ?? ""}
                  </span>
                  <h3 className="mt-1 font-obviously-wide font-semibold text-base text-black transition-colors group-hover:text-red">
                    {rel.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 font-tiempos-text text-sm text-black/60">
                    {rel.summary ?? ""}
                  </p>
                  <p className="mt-2 font-obviously text-xs text-black/40">
                    {(rel.author as { name?: string } | undefined)?.name ?? "attn:seeker"} ·{" "}
                    {formatDate(rel.publishedDate ?? (rel as { publishDate?: string }).publishDate)}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

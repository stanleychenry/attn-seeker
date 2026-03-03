import Link from "next/link";
import Image from "next/image";
import { getTopicBySlug, getTopicById, getArticlesByTopicId, getSubTopics, getPillarTopics } from "@/lib/cms";
import { notFound } from "next/navigation";
import {
  Heading,
  Body,
  Section,
  Container,
  SectionIntro,
} from "@/components/ui";
import { TopicArticleList } from "./topic-article-list";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type PageParams = { params: { topicSlug: string } };

export const revalidate = 3600;
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const topic = await getTopicBySlug(params.topicSlug);
    if (!topic) return { title: "topic not found | attn:seeker" };
    return {
      title: `${topic.name} | attn:seeker`,
      description:
        (topic.shortDescription ?? topic.description) ??
        `articles about ${topic.name} from the attention seeker.`,
    };
  } catch {
    return { title: "topic not found | attn:seeker" };
  }
}

export default async function TopicPage({ params }: PageParams) {
  let topic: Awaited<ReturnType<typeof getTopicBySlug>> = null;
  let topicArticles: Awaited<ReturnType<typeof getArticlesByTopicId>> = [];
  let subTopics: Awaited<ReturnType<typeof getSubTopics>> = [];
  let parentTopic: Awaited<ReturnType<typeof getTopicById>> = null;
  let siblingTopics: Awaited<ReturnType<typeof getSubTopics>> = [];
  let pillarTopics: Awaited<ReturnType<typeof getPillarTopics>> = [];
  try {
    topic = await getTopicBySlug(params.topicSlug);
    if (!topic) notFound();
    const parentRef = topic.parentTopic;
    const parentId = typeof parentRef === "string" ? parentRef : parentRef?.id;
    [topicArticles, subTopics, parentTopic, siblingTopics, pillarTopics] = await Promise.all([
      getArticlesByTopicId(topic.id),
      getSubTopics(topic.id),
      parentId ? getTopicById(parentId) : Promise.resolve(null),
      parentId ? getSubTopics(parentId).then((subs) => subs.filter((s) => s.slug !== topic!.slug)) : Promise.resolve([]),
      getPillarTopics(),
    ]);
  } catch (error) {
    console.error("Failed to fetch topic:", error);
    notFound();
  }

  const sorted = [...topicArticles].sort((a, b) => {
    const aDate = a.publishDate ?? a.publishedDate ?? "";
    const bDate = b.publishDate ?? b.publishedDate ?? "";
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
  const featuredArticle = sorted[0];
  const editorsPicks = sorted.slice(1, 4);
  const remainingArticles = sorted.slice(4);

  const topicDescription = topic.shortDescription ?? topic.description ?? "";
  const topicImage = topic.featuredImage;
  const isPillarWithSubs = topic.isPillar && subTopics.length > 0;
  const isSubWithSiblings = !!parentTopic && siblingTopics.length > 0;

  return (
    <>
      {/* 1. Topic header */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Link
            href="/learn"
            className="font-obviously text-xs font-medium uppercase tracking-wide text-red hover:underline"
          >
            learn
          </Link>
          <Heading level={1} className="mt-4">
            {topic.name}
          </Heading>
          <Body
            className="mt-4 text-black/70"
          >
            {topicDescription}
          </Body>
          {topicImage ? (
            <div className="relative mt-8 aspect-video w-full overflow-hidden bg-black/5">
              <Image
                src={topicImage}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          ) : null}
          <hr className="mt-8 border-black/10" />
        </Container>
      </Section>

      {/* 2. Sub-topics (conditional) */}
      {isPillarWithSubs && (
        <Section background="bone" padding="none" className="py-4">
          <Container width="standard">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/learn/${topic.slug}`}
                className="inline-flex rounded-full bg-red px-4 py-1.5 font-obviously text-xs font-medium text-bone"
              >
                all
              </Link>
              {subTopics.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/learn/${sub.slug}`}
                  className={`inline-flex rounded-full px-4 py-1.5 font-obviously text-xs font-medium transition-colors ${
                    params.topicSlug === sub.slug
                      ? "bg-red text-bone"
                      : "bg-black/5 text-black/60 hover:bg-black/10"
                  }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
            <hr className="mt-4 border-black/10" />
          </Container>
        </Section>
      )}

      {/* 3. Featured article (conditional) */}
      {featuredArticle && (
        <Section background="bone" padding="none" className="py-8 md:py-12">
          <Container width="standard">
            <Link
              href={`/yap-articles/${featuredArticle.slug}`}
              className="group block"
            >
              <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                <div className="relative w-full md:w-[60%]">
                  <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                    {((featuredArticle as { coverImage?: string }).coverImage ?? featuredArticle.thumbnailUrl) ? (
                      <Image
                        src={(featuredArticle as { coverImage?: string }).coverImage ?? featuredArticle.thumbnailUrl ?? ""}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="flex w-full flex-col justify-center md:w-[40%]">
                  <span className="font-obviously text-xs font-medium uppercase tracking-wide text-red">
                    {topic.name}
                  </span>
                  <h2 className="mt-2 font-obviously-wide font-semibold text-xl text-black transition-colors group-hover:text-red md:text-2xl">
                    {featuredArticle.name}
                  </h2>
                  <p className="mt-3 line-clamp-3 font-tiempos-text text-sm text-black/70">
                    {featuredArticle.summary ?? ""}
                  </p>
                  <p className="mt-3 font-obviously text-xs text-black/40">
                    {(featuredArticle.author as { name?: string } | undefined)?.name ?? "attn:seeker"} ·{" "}
                    {formatDate(featuredArticle.publishedDate ?? (featuredArticle as { publishDate?: string }).publishDate)} ·{" "}
                    {(featuredArticle as { readingTime?: number }).readingTime ?? "—"}{" "}
                    min read
                  </p>
                </div>
              </div>
            </Link>
            <hr className="mt-8 border-black/10 md:mt-12" />
          </Container>
        </Section>
      )}

      {/* 4. Editor's picks (conditional) */}
      {editorsPicks.length > 0 && (
        <Section background="bone" padding="none" className="py-8">
          <Container width="standard">
            <span className="font-obviously text-sm font-medium text-red">
              editor&apos;s picks
            </span>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3">
              {editorsPicks.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/yap-articles/${article.slug}`}
                  className={`group block py-4 md:px-6 md:py-0 ${
                    i > 0
                      ? "border-t border-black/10 md:border-t-0 md:border-l md:border-black/10"
                      : ""
                  } ${i === 0 ? "md:pl-0" : ""} ${
                    i === editorsPicks.length - 1 ? "md:pr-0" : ""
                  }`}
                >
                  <span className="font-obviously text-xs text-red">
                    {topic.name}
                  </span>
                  <h3 className="mt-1 font-obviously-wide font-semibold text-base text-black transition-colors group-hover:text-red">
                    {article.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 font-tiempos-text text-sm text-black/60">
                    {article.summary ?? ""}
                  </p>
                  <p className="mt-2 font-obviously text-xs text-black/40">
                    {(article.author as { name?: string } | undefined)?.name ?? "attn:seeker"} ·{" "}
                    {formatDate(article.publishedDate ?? (article as { publishDate?: string }).publishDate)}
                  </p>
                </Link>
              ))}
            </div>
            <hr className="mt-8 border-black/10" />
          </Container>
        </Section>
      )}

      {/* 5. All articles */}
      {remainingArticles.length > 0 && (
        <Section background="bone" padding="none" className="py-8">
          <Container width="standard">
            <span className="font-obviously text-sm font-medium text-red">
              all articles
            </span>
            <TopicArticleList articles={remainingArticles} topicName={topic.name} />
          </Container>
        </Section>
      )}

      {/* 6. Related topics */}
      {(isPillarWithSubs || isSubWithSiblings) && (
        <Section background="bone" padding="none" className="py-16">
          <Container width="standard">
            {isPillarWithSubs && (
              <>
                <Heading level={2}>explore {topic.name}</Heading>
                <div className="mt-6 space-y-4">
                  {subTopics.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/learn/${sub.slug}`}
                      className="group block"
                    >
                      <h4 className="font-obviously-wide font-semibold text-base text-black transition-colors group-hover:text-red">
                        {sub.name}
                      </h4>
                      <p className="mt-0.5 font-tiempos-text text-sm text-black/50">
                        {sub.description ?? ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
            {isSubWithSiblings && (
              <>
                <Heading level={2}>related topics</Heading>
                {parentTopic && (
                  <Link
                    href={`/learn/${parentTopic.slug}`}
                    className="mt-6 block font-obviously text-sm text-red hover:underline"
                  >
                    ← back to {parentTopic.name}
                  </Link>
                )}
                <div className="mt-6 space-y-4">
                  {siblingTopics.map((sib) => (
                    <Link
                      key={sib.id}
                      href={`/learn/${sib.slug}`}
                      className="group block"
                    >
                      <h4 className="font-obviously-wide font-semibold text-base text-black transition-colors group-hover:text-red">
                        {sib.name}
                      </h4>
                      <p className="mt-0.5 font-tiempos-text text-sm text-black/50">
                        {sib.description ?? ""}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </Container>
        </Section>
      )}

      {/* Explore topics (same as main learn page, just above footer) */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="standard">
          <SectionIntro eyebrow="explore" heading="topics" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {pillarTopics.map((pillar) => {
              const topicImage = pillar.featuredImage;
              return (
                <Link
                  key={pillar.id}
                  href={`/learn/${pillar.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                    {topicImage ? (
                      <Image
                        src={topicImage}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-obviously-wide font-semibold text-base text-black transition-colors group-hover:text-red">
                    {pillar.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 font-tiempos-text text-sm text-black/60">
                    {(pillar.shortDescription ?? pillar.description) ?? ""}
                  </p>
                  <p className="mt-2 font-obviously text-xs text-black/40">
                    {pillar.articleCount ?? 0} articles
                  </p>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}

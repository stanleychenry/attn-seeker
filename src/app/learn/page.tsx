import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getPillarTopics, getFeaturedArticles, getYapArticles, getTopics } from "@/lib/cms";
import { LearnSearch } from "@/components/learn/learn-search";
import type { Topic } from "@/types/cms";
import {
  Body,
  Button,
  Caption,
  Section,
  Container,
  SectionIntro,
} from "@/components/ui";

function getTopicName(topicId: string | undefined, topics: Topic[]): string {
  if (!topicId) return "";
  const topic = topics.find((t) => t.id === topicId || t.slug === topicId);
  return topic?.name ?? "";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const metadata = {
  title: "learn | attn:seeker",
  description:
    "700+ articles on marketing, social media, and building brands that matter. from the team at the attention seeker.",
};

/** Cache the page and revalidate from Webflow every 5 minutes. */
export const revalidate = 300;

export default async function LearnPage() {
  let pillarTopics: Topic[] = [];
  let featuredList: Awaited<ReturnType<typeof getFeaturedArticles>> = [];
  let allArticles: Awaited<ReturnType<typeof getYapArticles>> = [];
  let topics: Topic[] = [];
  try {
    [pillarTopics, featuredList, allArticles, topics] = await Promise.all([
      getPillarTopics(),
      getFeaturedArticles(),
      getYapArticles(),
      getTopics(),
    ]);
  } catch (error) {
    console.error("Failed to fetch learn CMS data:", error);
  }

  const sorted = [...allArticles].sort((a, b) => {
    const aDate = a.publishDate ?? a.publishedDate ?? "";
    const bDate = b.publishDate ?? b.publishedDate ?? "";
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });
  const featuredArticle = featuredList[0] ?? sorted[0];
  const editorsPicks = sorted.slice(1, 4);
  const latestArticles = sorted.slice(4, 14);

  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Caption className="block text-red">learn</Caption>
          <div className="mt-4 w-full">
            <Image
              src="/brand/logos/TAS-HighRes-_YAP wordmark - Black.png"
              alt="YAP"
              width={800}
              height={200}
              className="h-auto w-full"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>

          {/* Beehiiv newsletter subscribe form - left-aligned with search bar, same max width */}
          <Script
            src="https://subscribe-forms.beehiiv.com/embed.js"
            strategy="afterInteractive"
          />
          <div className="mt-6 w-full max-w-[600px]">
            <iframe
              src="https://subscribe-forms.beehiiv.com/e66df1db-0e56-418b-96c5-5b6274a84204"
              className="beehiiv-embed"
              data-test-id="beehiiv-embed"
              title="Subscribe to the newsletter"
              frameBorder={0}
              scrolling="no"
              style={{
                width: "100%",
                height: 47,
                margin: 0,
                border: "none",
                borderRadius: 0,
                backgroundColor: "transparent",
                boxShadow: "0 0 #0000",
                maxWidth: "100%",
              }}
            />
          </div>

          <Body
            size="large"
            className="mt-6 max-w-[700px] text-black/70"
          >
            700+ articles on marketing, social media, and building brands that
            matter.
          </Body>
          <div className="mt-6 w-full max-w-[600px]">
            <LearnSearch />
          </div>
        </Container>
      </Section>

      {/* 2. Topic pills */}
      <Section background="bone" padding="none" className="py-4">
        <Container width="standard">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/learn"
              className="inline-flex max-w-full items-center justify-center rounded-full bg-red px-4 py-1.5 text-center font-obviously text-xs font-medium text-bone whitespace-normal"
            >
              all
            </Link>
            {pillarTopics.length === 0 ? null : pillarTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/learn/${topic.slug}`}
                className="inline-flex max-w-full items-center justify-center rounded-full bg-black/5 px-4 py-1.5 text-center font-obviously text-xs font-medium text-black/60 transition-colors hover:bg-black/10 whitespace-normal"
              >
                {topic.name}
              </Link>
            ))}
          </div>
          <hr className="mt-4 border-black/10" />
        </Container>
      </Section>

      {/* 3. Featured article */}
      {featuredArticle && (
        <Section background="bone" padding="none" className="py-8 md:py-12">
          <Container width="standard">
            <Link
              href={`/yap-articles/${featuredArticle.slug}`}
              className="group block"
            >
              <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                <div className="w-full md:w-[60%]">
                  <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                    {(featuredArticle.coverImage || featuredArticle.thumbnailUrl) ? (
                      <Image
                        src={featuredArticle.coverImage ?? featuredArticle.thumbnailUrl ?? ""}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 60vw"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="flex w-full flex-col justify-center md:w-[40%]">
                  <span className="font-obviously text-xs font-medium uppercase tracking-wide text-red">
                    {getTopicName(typeof featuredArticle.primaryTopic === "string" ? featuredArticle.primaryTopic : (featuredArticle.primaryTopic as Topic)?.id ?? (featuredArticle.primaryTopic as { slug?: string })?.slug, topics)}
                  </span>
                  <h2 className="mt-2 font-obviously-wide font-semibold text-xl text-black transition-colors group-hover:text-red md:text-2xl">
                    {featuredArticle.name}
                  </h2>
                  <p className="mt-3 line-clamp-3 font-tiempos-text text-sm text-black/70">
                    {featuredArticle.summary ?? ""}
                  </p>
                  <p className="mt-3 font-obviously text-xs text-black/40">
                    {typeof featuredArticle.author === "object" && featuredArticle.author?.name ? featuredArticle.author.name : typeof featuredArticle.author === "string" ? "attn:seeker" : "attn:seeker"} ·{" "}
                    {formatDate(featuredArticle.publishDate ?? featuredArticle.publishedDate)} ·{" "}
                    {featuredArticle.readingTime ?? "—"} min read
                  </p>
                </div>
              </div>
            </Link>
            <hr className="mt-8 border-black/10 md:mt-12" />
          </Container>
        </Section>
      )}

      {/* 4. Editor's picks */}
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
                    {getTopicName(typeof article.primaryTopic === "string" ? article.primaryTopic : (article.primaryTopic as { slug?: string })?.slug ?? (article.primaryTopic as { id?: string })?.id, topics)}
                  </span>
                  <h3 className="mt-1 font-obviously-wide font-semibold text-base text-black transition-colors group-hover:text-red">
                    {article.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 font-tiempos-text text-sm text-black/60">
                    {article.summary ?? ""}
                  </p>
                  <p className="mt-2 font-obviously text-xs text-black/40">
                    {typeof article.author === "object" && article.author?.name ? article.author.name : "attn:seeker"} ·{" "}
                    {formatDate(article.publishDate ?? article.publishedDate)}
                  </p>
                </Link>
              ))}
            </div>
            <hr className="mt-8 border-black/10" />
          </Container>
        </Section>
      )}

      {/* 5. Latest articles */}
      <Section background="bone" padding="none" className="py-8">
        <Container width="standard">
          <span className="font-obviously text-sm font-medium text-red">
            latest
          </span>
          <div className="mt-6 divide-y divide-black/10">
            {latestArticles.map((article) => {
              const thumb = article.coverImage ?? article.thumbnailUrl;
              return (
                <Link
                  key={article.id}
                  href={`/yap-articles/${article.slug}`}
                  className="group flex items-start gap-4 py-5"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-obviously text-xs text-red">
                      {getTopicName(typeof article.primaryTopic === "string" ? article.primaryTopic : (article.primaryTopic as { slug?: string })?.slug ?? (article.primaryTopic as { id?: string })?.id, topics)}
                    </span>
                    <h4 className="mt-1 font-obviously-wide font-semibold text-base text-black transition-colors group-hover:text-red">
                      {article.name}
                    </h4>
                    <p className="mt-1 font-obviously text-xs text-black/40">
                      {typeof article.author === "object" && article.author?.name ? article.author.name : "attn:seeker"} ·{" "}
                      {formatDate(article.publishDate ?? article.publishedDate)} ·{" "}
                      {article.readingTime ?? "—"} min read
                    </p>
                  </div>
                  <div className="relative h-[80px] w-[120px] shrink-0 overflow-hidden bg-black/5">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Button variant="ghost" type="button">
              load more
            </Button>
          </div>
        </Container>
      </Section>

      {/* 6. Explore topics */}
      <Section background="bone" padding="none" className="py-16">
        <Container width="standard">
          <SectionIntro eyebrow="explore" heading="topics" />
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {pillarTopics.map((topic) => {
              const topicImage = topic.featuredImage;
              return (
                <Link
                  key={topic.id}
                  href={`/learn/${topic.slug}`}
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
                    {topic.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 font-tiempos-text text-sm text-black/60">
                    {(topic.shortDescription ?? topic.description) ?? ""}
                  </p>
                  <p className="mt-2 font-obviously text-xs text-black/40">
                    {topic.articleCount ?? 0} articles
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

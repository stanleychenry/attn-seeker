import Link from "next/link";
import Image from "next/image";
import { getBookBySlug, getBookSlugs, getTeamById } from "@/lib/cms";
import type { Team } from "@/types/cms";
import { notFound } from "next/navigation";
import { Heading, Section, Container } from "@/components/ui";

type PageParams = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const slugs = await getBookSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageParams) {
  try {
    const book = await getBookBySlug(params.slug);
    if (!book) return { title: "book not found | attn:seeker" };
    const authorIds = (book as { authors?: string[] }).authors ?? [];
    const authorsResolved = await Promise.all(
      authorIds.map((id) => getTeamById(id))
    );
    const authorNames = authorsResolved
      .filter((a): a is Team => a != null)
      .map((a) => (a as { name?: string }).name ?? a.name);
    const authorsStr =
      authorNames.length > 0
        ? authorNames.join(", ")
        : (book as { author?: string }).author ?? book.author ?? "";
    const title = (book as { title?: string }).title ?? book.name;
    const description =
      (book as { subtitle?: string }).subtitle ??
      (book as { shortDescription?: string }).shortDescription ??
      "";
    return {
      title: `${title} | attn:seeker`,
      description: description || undefined,
      ...(authorsStr ? { authors: [{ name: authorsStr }] } : {}),
    };
  } catch {
    return { title: "book not found | attn:seeker" };
  }
}

export default async function BookDetailPage({ params }: PageParams) {
  let book: Awaited<ReturnType<typeof getBookBySlug>> = null;
  let resolvedAuthors: (Team | null)[] = [];
  try {
    book = await getBookBySlug(params.slug);
    if (!book) notFound();
    const authorIds = (book as { authors?: string[] }).authors ?? [];
    resolvedAuthors =
      authorIds.length > 0
        ? await Promise.all(authorIds.map((id) => getTeamById(id)))
        : [];
  } catch (error) {
    console.error("Failed to fetch book:", error);
    notFound();
  }

  const authorList = resolvedAuthors.filter((a): a is Team => a != null);
  const title = (book as { title?: string }).title ?? book.name;
  const coverUrl =
    (book as { coverUrl?: string }).coverUrl ??
    (book as { coverImage?: string }).coverImage ??
    book.coverUrl;
  const primaryCtaLink =
    (book as { primaryCtaLink?: string }).primaryCtaLink ?? book.buyUrl;
  const description =
    (book as { description?: string }).description ??
    (book as { body?: string }).body ??
    book.description;
  const descriptionIsHtml =
    typeof description === "string" && description?.includes("<");
  const excerpt = (book as { excerpt?: string }).excerpt ?? book.excerpt;
  const excerptIsHtml =
    typeof excerpt === "string" && excerpt?.includes("<");

  const proseClass =
    "prose prose-base max-w-none font-tiempos-text leading-relaxed prose-headings:font-obviously-wide prose-headings:font-semibold prose-a:text-red prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-red prose-blockquote:font-tiempos-headline prose-blockquote:not-italic prose-li:marker:text-red";

  return (
    <>
      {/* 1. Book header */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <Link
            href="/books"
            className="font-obviously text-xs uppercase tracking-wider text-red transition-colors hover:text-red/80"
          >
            ← books
          </Link>
          <div className="mt-6 flex flex-col gap-8 md:flex-row md:gap-12">
            <div className="w-full shrink-0 md:w-[300px]">
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/5">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-obviously text-xs text-black/30">
                      cover coming soon
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="font-obviously-wide text-2xl font-bold leading-tight md:text-3xl">
                {title}
              </h1>

              {(book as { subtitle?: string }).subtitle && (
                <p className="mt-2 font-tiempos-text text-lg text-black/70">
                  {(book as { subtitle?: string }).subtitle}
                </p>
              )}

              {authorList.length > 0 && (
                <p className="mt-3 font-obviously text-sm text-black/55">
                  {authorList.map((a, i) => (
                    <span key={a.id}>
                      {i > 0 && ", "}
                      <Link
                        href={`/agency/team/${a.slug}`}
                        className="text-red transition-colors hover:text-red/80"
                      >
                        {(a as { name?: string }).name ?? a.name}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
              {authorList.length === 0 &&
                ((book as { author?: string }).author ?? book.author) && (
                  <p className="mt-3 font-obviously text-sm text-black/55">
                    {(book as { author?: string }).author ?? book.author}
                  </p>
                )}

              <div className="mt-3 flex items-center gap-4">
                {(book as { publisher?: string }).publisher && (
                  <p className="font-obviously text-xs text-black/40">
                    {(book as { publisher?: string }).publisher}
                  </p>
                )}
                {(book as { isbn?: string }).isbn && (
                  <p className="font-obviously text-xs text-black/40">
                    isbn: {(book as { isbn?: string }).isbn}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                {(book as { status?: string }).status && (
                  <span
                    className={`rounded-full px-3 py-1 font-obviously text-xs font-medium ${
                      (book as { status?: string }).status === "released"
                        ? "bg-red text-bone"
                        : (book as { status?: string }).status === "preorder"
                          ? "bg-red/10 text-red"
                          : "bg-black/5 text-black/55"
                    }`}
                  >
                    {(book as { status?: string }).status === "preorder"
                      ? "pre-order"
                      : (book as { status?: string }).status}
                  </span>
                )}
                {(book as { releaseDate?: string }).releaseDate && (
                  <p className="font-obviously text-xs text-black/40">
                    {new Date(
                      (book as { releaseDate?: string }).releaseDate!
                    ).toLocaleDateString("en-NZ", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                {primaryCtaLink && (
                  <a
                    href={primaryCtaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-red px-5 py-2.5 font-obviously text-sm font-medium text-bone transition-colors hover:bg-red/90"
                  >
                    {(book as { primaryCtaLabel?: string }).primaryCtaLabel ??
                      "buy now"}
                  </a>
                )}
                {(book as { pressKitUrl?: string }).pressKitUrl && (
                  <a
                    href={(book as { pressKitUrl?: string }).pressKitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-black/20 px-5 py-2.5 font-obviously text-sm font-medium text-black/60 transition-colors hover:border-black/40"
                  >
                    press kit
                  </a>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Description */}
      {description && (
        <Section
          background="bone"
          padding="none"
          className="border-t border-black/10 py-8 md:py-16"
        >
          <Container width="content">
            {descriptionIsHtml ? (
              <div
                className={proseClass}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="font-tiempos-text text-base leading-relaxed text-black/80">
                {description}
              </p>
            )}
          </Container>
        </Section>
      )}

      {/* 3. Excerpt */}
      {excerpt && (
        <Section
          background="bone"
          padding="none"
          className="border-t border-black/10 py-8 md:py-16"
        >
          <Container width="content">
            <Heading level={2} className="mb-6">
              excerpt
            </Heading>
            {excerptIsHtml ? (
              <div
                className={proseClass}
                dangerouslySetInnerHTML={{ __html: excerpt }}
              />
            ) : (
              <p className="whitespace-pre-wrap font-tiempos-text text-base leading-relaxed text-black/80">
                {excerpt}
              </p>
            )}
          </Container>
        </Section>
      )}
    </>
  );
}

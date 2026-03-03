import Link from "next/link";
import Image from "next/image";
import { getBooks } from "@/lib/cms";
import { Heading, Section, Container } from "@/components/ui";

export const metadata = {
  title: "books | attn:seeker",
  description: "what we're reading and writing.",
};

export default async function BooksPage() {
  let books: Awaited<ReturnType<typeof getBooks>> = [];
  try {
    books = await getBooks();
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }

  return (
    <>
      {/* 1. Hero */}
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-obviously text-sm font-medium text-red">books</p>
          <Heading level={1} className="mt-4">
            what we&apos;re reading and writing
          </Heading>
        </Container>
      </Section>

      {/* 2. Books grid */}
      <Section background="bone" padding="none" className="py-8 md:py-16">
        <Container width="wide">
          <div
            className={`grid gap-10 md:gap-12 ${
              books.length === 1
                ? "mx-auto max-w-[300px] grid-cols-1"
                : books.length === 2
                  ? "mx-auto max-w-[650px] grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            }`}
          >
            {books.map((book) => {
              const authors = Array.isArray((book as { authors?: string[] }).authors)
                ? (book as { authors: string[] }).authors.join(", ")
                : (book as { authors?: string }).authors ?? (book as { author?: string }).author ?? book.author ?? "";
              const title = (book as { title?: string }).title ?? book.name;
              const subtitle = (book as { subtitle?: string }).subtitle;
              const coverUrl =
                (book as { coverUrl?: string }).coverUrl ??
                (book as { coverImage?: string }).coverImage ??
                book.coverUrl;
              const status = (book as { status?: string }).status;

              return (
                <Link
                  key={book.id}
                  href={`/books/${book.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/5">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-obviously text-xs text-black/30">
                          cover coming soon
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="mt-4 font-obviously-wide text-base font-semibold transition-colors group-hover:text-red">
                    {title}
                  </h3>

                  {subtitle && (
                    <p className="mt-1 font-tiempos-text text-sm text-black/60">
                      {subtitle}
                    </p>
                  )}

                  {authors && (
                    <p className="mt-2 font-obviously text-xs text-black/55">
                      {authors}
                    </p>
                  )}

                  {status && (
                    <span
                      className={`mt-2 inline-block rounded-full px-2.5 py-0.5 font-obviously text-[10px] font-medium ${
                        status === "released"
                          ? "bg-red text-bone"
                          : status === "preorder"
                            ? "bg-red/10 text-red"
                            : "bg-black/5 text-black/55"
                      }`}
                    >
                      {status === "preorder" ? "pre-order" : status}
                    </span>
                  )}
                </Link>
              );
            })}

            {books.length === 0 && (
              <p className="col-span-full py-12 text-center font-tiempos-text text-black/40">
                nothing here yet. check back soon.
              </p>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

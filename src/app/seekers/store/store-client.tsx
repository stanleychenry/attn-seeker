"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Heading, Section, Container } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import {
  getDashboard,
  getStoreItems,
  redeemReward,
  type XanoStoreItem,
} from "@/lib/xano";

export default function StoreClient() {
  const { user, isLoggedIn } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [items, setItems] = useState<XanoStoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemingId, setRedeemingId] = useState<string | number | null>(null);

  const load = useCallback(async () => {
    if (!isLoggedIn || !user?.email) {
      setBalance(null);
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [dash, storeList] = await Promise.all([
        getDashboard(user.email),
        getStoreItems(),
      ]);
      setBalance(dash.yap_dollars ?? 0);
      setItems(Array.isArray(storeList) ? storeList : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load store");
      setBalance(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user?.email]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRedeem = async (item: XanoStoreItem) => {
    if (!user?.email) return;
    const id = item.id;
    setRedeemingId(id);
    try {
      const result = await redeemReward(user.email, id);
      if (result.message === "Success" && result.new_balance != null) {
        setBalance(result.new_balance);
      }
      if (result.message === "Success") {
        alert(
          `Redeemed ${result.reward_name ?? item.name}! New balance: $${(result.new_balance ?? balance ?? 0).toFixed(2)}`
        );
        await load();
      } else {
        alert(result.message ?? "Redemption failed");
      }
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "redeem failed"));
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading && balance === null) {
    return (
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-tiempos-text text-black/60">Loading store…</p>
        </Container>
      </Section>
    );
  }

  if (!isLoggedIn) {
    return (
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-tiempos-text text-black/60">
            sign in to view the rewards store.
          </p>
        </Container>
      </Section>
    );
  }

  const displayBalance = balance ?? 0;

  return (
    <>
      <Section background="bone" padding="none" className="py-16 md:py-24">
        <Container width="standard">
          <p className="font-obviously text-sm font-medium text-red">
            rewards store
          </p>
          <Heading level={1} className="mt-4">
            spend your yap dollars
          </Heading>
          <p className="mt-3 font-tiempos-text text-lg text-black/70">
            <span className="font-obviously-narrow font-black text-red">
              ${displayBalance.toFixed(2)}
            </span>{" "}
            yap dollars available
          </p>
          {error && (
            <p className="mt-2 font-obviously text-xs text-red">{error}</p>
          )}
        </Container>
      </Section>

      <Section background="bone" padding="none" className="py-8 md:py-16">
        <Container width="wide">
          {items.length === 0 && !loading ? (
            <p className="py-8 text-center font-tiempos-text text-black/55">
              no rewards available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {items.map((product) => {
                const price = product.yap_dollars_cost ?? 0;
                const canAfford = displayBalance >= price;
                const isRedeeming = redeemingId === product.id;

                return (
                  <div
                    key={String(product.id)}
                    className="overflow-hidden rounded-lg bg-white"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-obviously text-xs text-black/20">
                            no image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-obviously-wide text-sm font-semibold">
                        {product.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 font-tiempos-text text-xs text-black/55">
                        {product.description ?? ""}
                      </p>

                      <p className="mt-3">
                        <span className="font-obviously-narrow text-lg font-black text-red">
                          ${price}
                        </span>
                        <span className="ml-1 font-obviously text-xs text-black/40">
                          yap dollars
                        </span>
                      </p>

                      <div className="mt-4">
                        <button
                          type="button"
                          disabled={!canAfford || isRedeeming}
                          onClick={() => handleRedeem(product)}
                          className={`w-full rounded-full py-2.5 font-obviously text-xs font-medium transition-colors ${
                            canAfford && !isRedeeming
                              ? "bg-red text-bone hover:bg-red/90"
                              : "cursor-not-allowed bg-black/10 text-black/30"
                          }`}
                        >
                          {isRedeeming
                            ? "redeeming…"
                            : canAfford
                              ? "redeem"
                              : "not enough yap dollars"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </Section>

      <Section
        background="bone"
        padding="none"
        className="border-t border-black/10 py-8 md:py-12"
      >
        <Container width="standard">
          <p className="mx-auto max-w-[500px] text-center font-obviously text-xs leading-relaxed text-black/40">
            earn yap dollars by engaging with the newsletter, playing daily
            games, and attending events. new products added quarterly.
          </p>
        </Container>
      </Section>
    </>
  );
}

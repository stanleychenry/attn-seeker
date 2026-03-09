/**
 * Algolia Rules and Synonyms for attn_seeker_global.
 * Rules boost content types based on query intent — no OpenAI needed.
 * Run as part of the sync (pushRulesAndSynonyms).
 */

import { algoliasearch } from "algoliasearch";
import { GLOBAL_INDEX_NAME } from "@/lib/algolia-sync";

type AlgoliaClient = ReturnType<typeof algoliasearch>;

// ---------------------------------------------------------------------------
// Rules
// Each entry defines a trigger phrase and which contentType to boost.
// Multiple phrases can map to the same boost.
// ---------------------------------------------------------------------------

interface RuleDef {
  phrase: string;
  boost: string[];
  description: string;
}

const RULE_DEFS: RuleDef[] = [
  // Service intent — "help with X", "manage my X", "need help", "run my", "grow my"
  { phrase: "help with", boost: ["contentType:service<score=10>"], description: "service: help with" },
  { phrase: "help me", boost: ["contentType:service<score=10>"], description: "service: help me" },
  { phrase: "manage my", boost: ["contentType:service<score=10>"], description: "service: manage my" },
  { phrase: "need help", boost: ["contentType:service<score=10>"], description: "service: need help" },
  { phrase: "run my", boost: ["contentType:service<score=10>"], description: "service: run my" },
  { phrase: "grow my", boost: ["contentType:service<score=10>"], description: "service: grow my" },
  { phrase: "I need", boost: ["contentType:service<score=8>"], description: "service: I need" },
  { phrase: "take over my", boost: ["contentType:service<score=10>"], description: "service: take over my" },
  { phrase: "can you help", boost: ["contentType:service<score=10>"], description: "service: can you help" },

  // Agency/hire intent
  { phrase: "hire", boost: ["contentType:service<score=10>", "contentType:case-study<score=6>"], description: "agency: hire" },
  { phrase: "work with you", boost: ["contentType:service<score=10>", "contentType:case-study<score=6>"], description: "agency: work with you" },
  { phrase: "pricing", boost: ["contentType:service<score=10>"], description: "agency: pricing" },
  { phrase: "packages", boost: ["contentType:service<score=10>"], description: "agency: packages" },
  { phrase: "what do you offer", boost: ["contentType:service<score=10>"], description: "agency: what do you offer" },
  { phrase: "what do you do", boost: ["contentType:service<score=10>", "contentType:case-study<score=6>"], description: "agency: what do you do" },
  { phrase: "how much", boost: ["contentType:service<score=10>"], description: "agency: how much" },

  // Event intent
  { phrase: "event", boost: ["contentType:event<score=10>"], description: "event: event" },
  { phrase: "events", boost: ["contentType:event<score=10>"], description: "event: events" },
  { phrase: "upcoming", boost: ["contentType:event<score=10>"], description: "event: upcoming" },
  { phrase: "what's on", boost: ["contentType:event<score=10>"], description: "event: what's on" },
  { phrase: "workshop", boost: ["contentType:event<score=10>"], description: "event: workshop" },
  { phrase: "webinar", boost: ["contentType:event<score=10>"], description: "event: webinar" },
  { phrase: "attend", boost: ["contentType:event<score=10>"], description: "event: attend" },

  // Team/person intent
  { phrase: "who is", boost: ["contentType:team<score=10>"], description: "team: who is" },
  { phrase: "who are", boost: ["contentType:team<score=10>"], description: "team: who are" },
  { phrase: "meet the team", boost: ["contentType:team<score=10>"], description: "team: meet the team" },
  { phrase: "founder", boost: ["contentType:team<score=10>"], description: "team: founder" },
  { phrase: "staff", boost: ["contentType:team<score=10>"], description: "team: staff" },

  // Podcast intent
  { phrase: "podcast", boost: ["contentType:podcast<score=10>", "contentType:podcast-episode<score=8>"], description: "podcast: podcast" },
  { phrase: "listen", boost: ["contentType:podcast<score=10>", "contentType:podcast-episode<score=8>"], description: "podcast: listen" },

  // Show/video intent
  { phrase: "watch", boost: ["contentType:show<score=10>", "contentType:show-episode<score=8>"], description: "show: watch" },

  // Article/learn intent
  { phrase: "article", boost: ["contentType:article<score=10>", "contentType:topic<score=8>"], description: "content: article" },
  { phrase: "read", boost: ["contentType:article<score=10>", "contentType:topic<score=8>"], description: "content: read" },
  { phrase: "learn about", boost: ["contentType:article<score=10>", "contentType:topic<score=8>"], description: "content: learn about" },
  { phrase: "newsletter", boost: ["contentType:article<score=10>"], description: "content: newsletter" },

  // Case study intent
  { phrase: "case study", boost: ["contentType:case-study<score=10>"], description: "case study: case study" },
  { phrase: "case studies", boost: ["contentType:case-study<score=10>"], description: "case study: case studies" },
  { phrase: "portfolio", boost: ["contentType:case-study<score=10>"], description: "case study: portfolio" },
  { phrase: "results", boost: ["contentType:case-study<score=8>"], description: "case study: results" },
  { phrase: "proof", boost: ["contentType:case-study<score=8>"], description: "case study: proof" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildRules() {
  return RULE_DEFS.map((def) => ({
    objectID: `auto-${def.phrase.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`,
    conditions: [
      {
        pattern: def.phrase,
        anchoring: "contains" as const,
        alternatives: true,
      },
    ],
    consequence: {
      params: {
        optionalFilters: def.boost,
      },
    },
    description: def.description,
    enabled: true,
  }));
}

// ---------------------------------------------------------------------------
// Synonyms
// ---------------------------------------------------------------------------

const SYNONYMS = [
  { objectID: "syn-socials", synonyms: ["socials", "social media", "social"] },
  { objectID: "syn-tiktok", synonyms: ["tiktok", "tik tok"] },
  { objectID: "syn-instagram", synonyms: ["insta", "instagram"] },
  { objectID: "syn-linkedin", synonyms: ["linkedin", "linked in"] },
  { objectID: "syn-podcast", synonyms: ["podcast", "podcasts"] },
  { objectID: "syn-show", synonyms: ["show", "shows"] },
  { objectID: "syn-event", synonyms: ["event", "events"] },
  { objectID: "syn-article", synonyms: ["article", "articles", "blog", "post", "posts"] },
  { objectID: "syn-hire", synonyms: ["hire", "work with", "engage"] },
  { objectID: "syn-agency", synonyms: ["agency", "team", "company"] },
  { objectID: "syn-content", synonyms: ["content", "posts", "videos", "creative"] },
  { objectID: "syn-grow", synonyms: ["grow", "increase", "build", "scale"] },
];

// ---------------------------------------------------------------------------
// Push
// ---------------------------------------------------------------------------

export async function pushRulesAndSynonyms(client: AlgoliaClient): Promise<void> {
  // Synonyms work on all plans
  await client.saveSynonyms({
    indexName: GLOBAL_INDEX_NAME,
    synonymHit: SYNONYMS.map((s) => ({ ...s, type: "synonym" as const })),
    forwardToReplicas: false,
    replaceExistingSynonyms: true,
  });

  console.log(`[algolia-rules] pushed ${SYNONYMS.length} synonyms`);

  // Rules with optionalFilters require a paid Algolia plan feature.
  // On Grow plan, boosting is handled by contentTypePriority (customRanking) + keyword enrichment.
  // Uncomment the block below when upgrading to a plan with Rules + optionalFilters.
  //
  // const rules = buildRules();
  // await client.saveRules({
  //   indexName: GLOBAL_INDEX_NAME,
  //   rules,
  //   forwardToReplicas: false,
  //   clearExistingRules: true,
  // });
  // console.log(`[algolia-rules] pushed ${rules.length} rules`);
}

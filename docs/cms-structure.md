# TAS Website - Webflow CMS Structure

> Auto-generated from Webflow API on 2026-02-21
> Site ID: `6903f966907f4df2c9e6c38b`

---

## Overview

| # | Collection | ID | Slug | Fields |
|---|---|---|---|---|
| 1 | Teams | `6903fbac0e9ee52349381d09` | `team` | 16 |
| 2 | Shows | `690400b4c81ed34dbe232792` | `shows` | 17 |
| 3 | Show Episodes | `690403aaed7c9052daa73012` | `episodes` | 15 |
| 4 | Podcasts | `6904f893417ab873045acdad` | `podcasts` | 17 |
| 5 | Podcast Episodes | `6904f9ebeda603740d2eb248` | `podcast-episodes` | 16 |
| 6 | YAP Articles | `6904fc8a553a443083c35a66` | `yap-articles` | 24 |
| 7 | Categories | `690537c488e7ef1eb83647fb` | `category` | 2 |
| 8 | Products | `690537c488e7ef1eb83647fc` | `product` | 13 |
| 9 | SKUs | `690537c488e7ef1eb8364800` | `sku` | 16 |
| 10 | Landing Pages | `69054a1ae43f08cf4655267c` | `landing` | 33 |
| 11 | Books | `69054b039f4efa1a73e777be` | `books` | 20 |
| 12 | Events Series | `690659ec4283f4085fac28a7` | `events-series` | 10 |
| 13 | Events | `690661ddfa0fb65117465141` | `events` | 29 |
| 14 | Topics | `694f47a6bab20226d30f7b20` | `topics` | 15 |
| 15 | Jobs | `694f7da9e77e5b3348eb247f` | `jobs` | 19 |
| 16 | Case Studies | `6950a412ce68db24df58f7ca` | `case-studies` | 23 |
| 17 | Services | `6952391019949fbd2cb183bb` | `services` | 15 |

---

## Relationships Map

```
Show Episodes --[show]--> Shows
Podcast Episodes --[podcast]--> Podcasts
YAP Articles --[author-2]--> Teams
YAP Articles --[primary-topics]--> Topics
YAP Articles --[secondary-topics]--> Topics (multi)
Products --[category]--> Categories (multi)
Products --[default-sku]--> SKUs
Products --[associated-book]--> Books
Products --[associated-show]--> Shows
Products --[associated-event-series]--> Events Series
SKUs --[product]--> Products
Landing Pages --[show-grid---articles]--> YAP Articles (multi)
Landing Pages --[show-grid---shows]--> Shows (multi)
Landing Pages --[case-studies]--> Case Studies
Books --[product]--> Products
Books --[author-s]--> Teams (multi)
Events --[event-series]--> Events Series
Events --[speakers-hosts]--> Teams (multi)
Topics --[parent-topic]--> Topics (self-reference)
Topics --[editor-s-picks]--> YAP Articles (multi)
```

---

## Collection Details

### 1. Teams

- **Collection ID:** `6903fbac0e9ee52349381d09`
- **Slug:** `team`
- **Singular Name:** Team

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Role | `role` | PlainText | No | Single line |
| Headshot | `headshot` | Image | No | Square photo |
| LinkedIn URL | `linkedin-url` | Link | No | |
| TikTok URL | `tiktok-url` | Link | No | |
| Instagram URL | `instagram-url` | Link | No | |
| YouTube URL | `youtube-url` | Link | No | |
| Sort Order | `sort-order` | Number | No | Integer, no negatives |
| Featured | `featured` | Switch | No | Highlight key team members |
| Bio | `bio` | RichText | No | |
| SEO Title | `seo-title` | PlainText | No | |
| SEO Description | `seo-description` | PlainText | No | Max 160 chars |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 2. Shows

- **Collection ID:** `690400b4c81ed34dbe232792`
- **Slug:** `shows`
- **Singular Name:** Show

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Poster | `poster` | Image | No | 1920x1080 cover image |
| Short Description | `short-description` | PlainText | No | Single line, ~160 chars |
| Description | `description` | RichText | No | Full synopsis |
| YouTube Playlist ID | `youtube-playlist-id` | PlainText | No | Single line, ID only |
| Category | `category` | Option | No | Business, Culture, Comedy, Education, Other |
| Status | `status` | Option | No | Active, Hiatus, Ended |
| Featured | `featured` | Switch | No | |
| Playlist URL | `playlist-url` | Link | No | |
| Subscribe to YouTube Channel Link | `subscribe-to-youtube-channel-link` | Link | No | ?sub_confirmation=1 format |
| SEO Title | `seo-title` | PlainText | No | |
| SEO Description | `seo-description` | PlainText | No | |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 3. Show Episodes

- **Collection ID:** `690403aaed7c9052daa73012`
- **Slug:** `episodes`
- **Singular Name:** Show Episode

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Show | `show` | Reference | No | → Shows (`690400b4c81ed34dbe232792`) |
| Episode Number | `episode-number` | Number | No | Integer, no negatives |
| YouTube Video ID | `youtube-video-id` | PlainText | No | Single line, ID only (e.g. dQw4w9WgXcQ) |
| Publish Date | `publish-date` | DateTime | No | |
| Short Description | `short-description` | PlainText | No | Single line |
| Transcript | `transcript` | RichText | No | For SEO |
| Thumbnail | `thumbnail` | Image | No | |
| Featured | `featured` | Switch | No | |
| SEO Title | `seo-title` | PlainText | No | |
| SEO Description | `seo-description` | PlainText | No | |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 4. Podcasts

- **Collection ID:** `6904f893417ab873045acdad`
- **Slug:** `podcasts`
- **Singular Name:** Podcast

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Cover Image | `cover-image` | Image | No | Square, 1400x1400px+ |
| Short Description | `short-description` | PlainText | No | Single line, ~160 chars |
| Description | `description` | RichText | No | Full show summary |
| Spotify Link | `spotify-link` | Link | No | |
| Category | `category` | Option | No | Business, Culture, Comedy, Education, Other |
| Status | `status` | Option | No | Active, Hiatus, Ended |
| Featured | `featured` | Switch | No | |
| Spotify Show ID | `spotify-embed-code` | PlainText | No | Single line |
| SEO Title | `seo-title` | PlainText | No | |
| SEO Description | `seo-description` | PlainText | No | |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 5. Podcast Episodes

- **Collection ID:** `6904f9ebeda603740d2eb248`
- **Slug:** `podcast-episodes`
- **Singular Name:** Podcast Episode

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Podcast | `podcast` | Reference | No | → Podcasts (`6904f893417ab873045acdad`) |
| Episode Number | `episode-number` | Number | No | Integer, no negatives |
| Publish Date | `publish-date` | DateTime | No | |
| Description | `description` | RichText | No | Full show notes |
| Spotify Embed | `spotify-embed` | PlainText | No | Single line, embed link |
| Thumbnail | `thumbnail` | Image | No | Square or 16:9 |
| Transcript | `transcript` | RichText | No | For SEO |
| Featured | `featured` | Switch | No | |
| SEO Title | `seo-title` | PlainText | No | |
| SEO Description | `seo-description` | PlainText | No | |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 6. YAP Articles

- **Collection ID:** `6904fc8a553a443083c35a66`
- **Slug:** `yap-articles`
- **Singular Name:** YAP Article
- **Note:** This is the main content collection. Articles are migrated from Beehiiv and enriched with AI-generated metadata.

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Author | `author-2` | Reference | No | → Teams (`6903fbac0e9ee52349381d09`) |
| Publish Date | `publish-date` | DateTime | No | |
| Cover Image | `cover-image` | Image | No | |
| Summary | `summary` | PlainText | No | Single line, short intro |
| Body | `body` | RichText | No | Full article content |
| Original URL | `original-url` | Link | No | Beehiiv source link |
| Category | `category` | Option | No | Marketing, Attention, Social Media, Leadership, Business, Pop Culture, Other |
| Featured | `featured` | Switch | No | |
| Primary Topic | `primary-topics` | Reference | No | → Topics (`694f47a6bab20226d30f7b20`). Determines URL structure |
| Secondary Topics | `secondary-topics` | MultiReference | No | → Topics (`694f47a6bab20226d30f7b20`). For internal linking |
| Content Type | `content-type` | Option | No | Provocation, Blueprint, Tutorial, Case Study, Pulse |
| Audience | `audience` | Option | No | Social Media Managers, Marketers, CMOs / Marketing Leaders, Founders / Business Owners, Content Creators |
| Funnel Stage | `funnel-stage` | Option | No | Awareness, Consideration, Decision |
| Last Updated | `last-updated` | DateTime | No | Freshness signal |
| Meta Title | `meta-title` | PlainText | No | Single line, SEO override |
| Meta Description | `meta-description` | PlainText | No | Single line |
| Reading Time | `reading-time` | Number | No | Integer, minutes |
| Beehiiv ID | `beehiiv-id` | PlainText | No | Single line, migration tracking |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 7. Categories

- **Collection ID:** `690537c488e7ef1eb83647fb`
- **Slug:** `category`
- **Singular Name:** Category
- **Note:** Webflow Ecommerce default collection. Used by Products.

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |

---

### 8. Products

- **Collection ID:** `690537c488e7ef1eb83647fc`
- **Slug:** `product`
- **Singular Name:** Product
- **Note:** Webflow Ecommerce collection. Used for books, events, merch, and Seekers rewards store.

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| SKU Properties | `sku-properties` | SkuSettings | No | |
| Categories | `category` | MultiReference | No | → Categories (`690537c488e7ef1eb83647fb`) |
| Description | `description` | PlainText | No | |
| Requires Shipping | `shippable` | Switch | No | |
| Tax Category | `tax-category` | TextOption | No | |
| Default SKU | `default-sku` | Reference | No | → SKUs (`690537c488e7ef1eb8364800`) |
| Product type (Ecommerce) | `ec-product-type` | Option | No | Physical, Digital, Service, Membership, Advanced |
| Product Type (Custom) | `product-type` | Option | No | Books, Intensive Workshops, Seekers Pro, Friday Night Lights, The Dating Void, Comedy Drive, Lectures After Dark, AM Club, The Cohort, Workshops, Merch |
| Associated Book | `associated-book` | Reference | No | → Books (`69054b039f4efa1a73e777be`) |
| Associated Show | `associated-show` | Reference | No | → Shows (`690400b4c81ed34dbe232792`) |
| Associated Event Series | `associated-event-series` | Reference | No | → Events Series (`690659ec4283f4085fac28a7`) |

---

### 9. SKUs

- **Collection ID:** `690537c488e7ef1eb8364800`
- **Slug:** `sku`
- **Singular Name:** SKU
- **Note:** Webflow Ecommerce default collection. Linked to Products.

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| SKU Values | `sku-values` | SkuValues | Yes | |
| Product | `product` | Reference | Yes | → Products (`690537c488e7ef1eb83647fc`) |
| Main Image | `main-image` | Image | No | jpeg, jpg, gif, png, webp, avif |
| More Images | `more-images` | MultiImage | No | |
| Price | `price` | Price | Yes | |
| Compare-at price | `compare-at-price` | Price | No | |
| Downloads | `download-files` | MultiExternalFile | No | |
| Subscription Plan | `ec-sku-subscription-plan` | MembershipPlan | No | |
| Width | `width` | Number | No | Min 0 |
| Length | `length` | Number | No | Min 0 |
| Height | `height` | Number | No | Min 0 |
| Weight | `weight` | Number | No | Min 0 |
| SKU | `sku` | PlainText | No | Single line |
| Billing method | `ec-sku-billing-method` | TextOption | No | |

---

### 10. Landing Pages

- **Collection ID:** `69054a1ae43f08cf4655267c`
- **Slug:** `landing`
- **Singular Name:** Landing Page
- **Note:** Flexible CMS-driven landing pages for campaigns, services, and audience-specific pages.

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Audience | `audience` | Option | No | Enterprise, SME's, Start Ups, Solopreneurs |
| Hero Headline | `hero-headline` | PlainText | No | Single line |
| Hero Subheading | `hero-subheading` | PlainText | No | Single line |
| Hero Image | `hero-image` | Image | No | |
| Primary CTA Label | `primary-cta-label` | PlainText | No | Single line |
| Primary CTA Type | `primary-cta-type` | Option | No | Lead Form, Calendar Booking, Email, External URL, Event Purchase, Product Purchase |
| Primary CTA Target | `primary-cta-target` | Link | No | |
| Lead Form Success Redirect | `lead-form-success-redirect` | Link | No | |
| Show Newsletter CTA | `show-newsletter-cta` | Switch | No | |
| Problem Title | `problem-title` | PlainText | No | Single line |
| Problem List | `problem-list` | RichText | No | Bullet points |
| Problem Image | `problem-image` | Image | No | |
| Solution Title | `solution-title` | PlainText | No | Single line |
| Solution / Offer | `solution-offer` | RichText | No | |
| Solution Image | `solution-image` | Image | No | |
| Deliverables Title | `deliverables-title` | PlainText | No | Single line |
| Deliverables / Packages | `deliverables-packages` | RichText | No | |
| Proof - Case Study Title | `proof---case-study-title` | PlainText | No | Single line |
| Proof - Case Study Summary | `proof---case-study-summary` | RichText | No | |
| Proof - Logo | `proof---logo` | Image | No | |
| Proof Image | `proof-image` | Image | No | |
| Case Studies | `case-studies` | Reference | No | → Case Studies (`6950a412ce68db24df58f7ca`) |
| Testimonial Quote | `testimonial-quote` | PlainText | No | Multi-line |
| Testimonial Attribution | `testimonial-attribution` | PlainText | No | Single line |
| Testimonial Photo | `testimonial-photo` | Image | No | |
| Show Grid - Articles | `show-grid---articles` | MultiReference | No | → YAP Articles (`6904fc8a553a443083c35a66`) |
| Show Grid - Shows | `show-grid---shows` | MultiReference | No | → Shows (`690400b4c81ed34dbe232792`) |
| SEO Title | `seo-title` | PlainText | No | Single line |
| SEO Description | `seo-description` | PlainText | No | Single line |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | |

---

### 11. Books

- **Collection ID:** `69054b039f4efa1a73e777be`
- **Slug:** `books`
- **Singular Name:** Book

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Subtitle | `subtitle` | PlainText | No | Single line |
| Status | `status` | Option | No | Upcoming, Preorder, Released |
| Cover Image | `cover-image` | Image | No | |
| Description | `description` | RichText | No | |
| Excerpt | `exerpt` | RichText | No | Note: slug has typo "exerpt" |
| Release Date | `release-date` | DateTime | No | |
| Primary CTA Label | `primary-cta-label` | PlainText | No | Single line |
| Primary CTA Link | `primary-cta-link` | Link | No | |
| Press Kit URL | `press-kit-url` | Link | No | |
| Product | `product` | Reference | No | → Products (`690537c488e7ef1eb83647fc`) |
| Author/s | `author-s` | MultiReference | No | → Teams (`6903fbac0e9ee52349381d09`) |
| Publisher | `publisher` | PlainText | No | Single line |
| ISBN | `isbn` | PlainText | No | Single line |
| OG Image | `og-image` | Image | No | |
| SEO Title | `seo-title` | PlainText | No | Single line |
| SEO Description | `seo-description` | PlainText | No | Single line |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |

---

### 12. Events Series

- **Collection ID:** `690659ec4283f4085fac28a7`
- **Slug:** `events-series`
- **Singular Name:** Events Series

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Short Description | `short-description` | PlainText | No | Single line |
| Hero Image | `hero-image` | Image | No | |
| Body Text | `body-text` | RichText | No | |
| SEO Title | `seo-title` | PlainText | No | |
| SEO Description | `seo-description` | PlainText | No | |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 13. Events

- **Collection ID:** `690661ddfa0fb65117465141`
- **Slug:** `events`
- **Singular Name:** Event

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Event Series | `event-series` | Reference | No | → Events Series (`690659ec4283f4085fac28a7`) |
| Event Tier | `event-tier` | Option | No | Free, Mid ($20-100), Top (Premium) |
| Status | `status` | Option | No | Upcoming, Waitlist, Sold Out, Past |
| Start Date/Time | `start-date-time` | DateTime | No | |
| End Date/Time | `end-date-time` | DateTime | No | |
| Timezone Label | `timezone-label` | PlainText | No | Single line |
| Venue | `venue` | PlainText | No | Single line |
| Address/Map | `address-map` | Link | No | Google Maps link |
| Hero Image | `hero-image` | Image | No | |
| Gallery | `gallery` | MultiImage | No | |
| Short Summary | `short-summary` | PlainText | No | Single line |
| Event Description | `event-description` | RichText | No | |
| Schedule / Agenda | `schedule-agenda` | RichText | No | |
| Speakers / Hosts | `speakers-hosts` | MultiReference | No | → Teams (`6903fbac0e9ee52349381d09`) |
| Capacity | `capacity` | Number | No | Integer |
| Tickets Remaining | `tickets-remaining` | Number | No | Integer |
| Show on Listings | `show-on-listings` | Switch | No | |
| Is Online | `is-online` | Switch | No | |
| Price Display | `price-display` | PlainText | No | Single line |
| Humanitix Ticket URL | `ticket-url` | Link | No | |
| Humanitix Event ID | `humanitix-event-id` | PlainText | No | Single line, for webhook integration |
| Recording URL | `recording-url` | Link | No | |
| Confirmation Email | `confirmation-email` | RichText | No | Post-purchase email content |
| SEO Title | `seo-title` | PlainText | No | Single line |
| SEO Description | `seo-description` | PlainText | No | Single line |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | |

---

### 14. Topics

- **Collection ID:** `694f47a6bab20226d30f7b20`
- **Slug:** `topics`
- **Singular Name:** Topic
- **Note:** Hierarchical taxonomy. 6 pillars (Is Pillar = On) with 32 sub-topics. Self-referencing Parent Topic field creates the hierarchy.

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Description | `description` | RichText | No | Topic hub page content |
| Short Description | `short-descritpion` | PlainText | No | Single line, max 160 chars. Note: slug has typo |
| Parent Topic | `parent-topic` | Reference | No | → Topics (`694f47a6bab20226d30f7b20`) Self-reference. Empty = pillar |
| Featured Image | `featured-image` | Image | No | Hero image for hub page |
| Icon | `icon` | Image | No | Small icon for nav |
| Meta Title | `meta-title` | PlainText | No | Single line |
| Meta Description | `meta-description` | PlainText | No | Single line, max 160 chars |
| Sort Order | `sort-order` | Number | No | Integer, lower = first |
| Is Pillar | `is-pillar` | Switch | No | ON for top-level pillars |
| Editor's Picks | `editor-s-picks` | MultiReference | No | → YAP Articles (`6904fc8a553a443083c35a66`). Select 3 featured articles |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 15. Jobs

- **Collection ID:** `694f7da9e77e5b3348eb247f`
- **Slug:** `jobs`
- **Singular Name:** Job

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Job Title | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Department | `department` | Option | No | Executive Leadership, Creative, Strategy, Client Services, Community Management, Production, Operations, Brand & Product |
| Location | `location` | Option | No | Auckland, Sydney, New York, Remote |
| Employment Type | `employment-type` | Option | No | Full-Time, Part-Time, Contract, Remote |
| Description | `description` | RichText | No | Full job description |
| Requirements | `requirements` | RichText | No | Skills needed |
| Apply Link | `apply-link` | Link | No | |
| Closing Date | `closing-date` | DateTime | No | |
| Open | `open` | Switch | No | Show/hide toggle |
| Custom Question 1 | `custom-question-1` | PlainText | No | Single line |
| Custom Question 2 | `custom-question-2` | PlainText | No | Single line |
| Custom Question 3 | `custom-question-3` | PlainText | No | Single line |
| Custom Question 4 | `custom-question-4` | PlainText | No | Single line |
| Custom Question 5 | `custom-question-5` | PlainText | No | Single line |
| SEO Title | `seo-title` | PlainText | No | |
| SEO Description | `seo-description` | PlainText | No | |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 16. Case Studies

- **Collection ID:** `6950a412ce68db24df58f7ca`
- **Slug:** `case-studies`
- **Singular Name:** Case Study

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Client Logo | `client-logo` | Image | Yes | |
| Cover Image | `cover-image` | Image | No | |
| Headline | `headline` | PlainText | No | Single line, AI-generated SEO title |
| Challenge | `challenge` | RichText | No | |
| Challenge Image | `challenge-image` | Image | No | |
| Solution | `solution` | RichText | No | |
| Solution Image | `solution-image` | Image | No | |
| Results | `results` | RichText | No | |
| Results Image | `results-image` | Image | No | |
| Key Stat | `key-stat` | PlainText | Yes | Single line |
| Key Stat Label | `key-stat-label` | PlainText | Yes | Single line |
| Testimonial | `testimonial-2` | RichText | No | |
| Testimonial Author | `testimonial-authour` | PlainText | No | Single line. Note: slug has typo |
| Featured | `featured` | Switch | No | |
| Featured Order | `featured-order` | Number | No | Integer |
| Region | `region` | Option | No | Australia, Canada, New Zealand, United Arab Emirates, United Kingdom, United States |
| Industry | `industry` | Option | No | Technology, Food & Beverage, Entertainment, Beauty & Fashion, Finance & Insurance, Health & Wellness, Travel & Hospitality, Retail & E-commerce, Education, Government & Non-Profit, Professional Services, Automotive, Consumer Goods |
| SEO Title | `seo-title` | PlainText | No | |
| SEO Description | `seo-description` | PlainText | No | |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

### 17. Services

- **Collection ID:** `6952391019949fbd2cb183bb`
- **Slug:** `services`
- **Singular Name:** Service

| Field | Slug | Type | Required | Notes |
|---|---|---|---|---|
| Name | `name` | PlainText | Yes | Max 256 chars |
| Slug | `slug` | PlainText | Yes | Max 256 chars |
| Headline | `headline` | PlainText | No | Single line, SEO H1 |
| Description | `description` | PlainText | No | Single line, 1-2 sentences |
| Body | `body` | RichText | No | Main content |
| Icon | `icon` | Image | No | For cards/lists |
| Cover Image | `cover-image` | Image | No | Hero background |
| Key Benefits | `key-benefits` | RichText | No | What clients get |
| Process | `process` | RichText | No | How it works |
| Featured | `featured` | Switch | No | Show on homepage |
| Sort Order | `sort-order` | Number | No | Integer, display order |
| SEO Title | `seo-title` | PlainText | No | |
| SEO Description | `seo-description` | PlainText | No | |
| OG Title | `og-title` | PlainText | No | |
| OG Description | `og-description` | PlainText | No | |
| OG Image | `og-image` | Image | No | 1200x630px recommended |

---

## Option Field Values Reference

This section lists all option field values with their internal IDs for API/automation use.

### YAP Articles - Category
| Option | ID |
|---|---|
| Marketing | `548503c3b361ac3d25add92526790fc8` |
| Attention | `e10195f7aa2b4f67032deecb25eb2511` |
| Social Media | `91c62ccbfb9765828477587139ce3879` |
| Leadership | `0e1d8526d7cf5268dd1e4ad555593b16` |
| Business | `24b8ea5a5143b9b7086705e1d880fb7f` |
| Pop Culture | `e8e4d2b6e7498ac74fcad11474847c31` |
| Other | `9902efae3ce9ab5de0a544bcce08d172` |

### YAP Articles - Content Type
| Option | ID |
|---|---|
| Provocation | `90c2cbbdeb6d89bdb0073dc7468eb42c` |
| Blueprint | `f9640ac70ac5f954341eabf47542bdd1` |
| Tutorial | `736989c9844eca74ed07670330c6fa37` |
| Case Study | `b4b97d769d9f7d8c386eddb0220a1318` |
| Pulse | `92c09047300da1b2581caa7097248816` |

### YAP Articles - Audience
| Option | ID |
|---|---|
| Social Media Managers | `4bd618df2f161a8521955f1aa6f358a7` |
| Marketers | `ca9833454e179d9e790836e783e6489a` |
| CMOs / Marketing Leaders | `5f37d679c50422c8e4c664ef3f7ad4e1` |
| Founders / Business Owners | `d77ce6a6e1433fd776e9539d610cabba` |
| Content Creators | `58fb5229683f02ca037250dfa3c54a03` |

### YAP Articles - Funnel Stage
| Option | ID |
|---|---|
| Awareness | `47f903d362b3309e07d2272ed3f29c3f` |
| Consideration | `ad67261ab22efa7f4aa43b2bfd8dd00c` |
| Decision | `69a693e2adc372b6f56532964e7b8fda` |

### Products - Product Type (Custom)
| Option | ID |
|---|---|
| Books | `97cdd143f988f304a5728fd4a6426135` |
| Intensive Workshops | `b06065b64facf16b8c6cfc446293a361` |
| Seekers Pro | `e4c7b3ad37af29035d7560cbc2ee7d18` |
| Friday Night Lights | `88d8e6759d68a850b293808cea8bf425` |
| The Dating Void | `6f0c26aae447c916c97d58ffee029c7a` |
| Comedy Drive | `ffcf3772003fac5670bfb6433b8e384b` |
| Lectures After Dark | `140586d82f1e872e042d9ab7bb3c73bc` |
| AM Club | `bb7cb1b26571ea237a39327297558d51` |
| The Cohort | `2650c1768b58392e8d369954a52f5a2f` |
| Workshops | `0fbbd3390cf85b3e8936b598a00bf41d` |
| Merch | `d96a6fe7c7c94e569e9fb54f4309de49` |

### Events - Status
| Option | ID |
|---|---|
| Upcoming | `d9c782d6f2e5a7d3153cb5978799b5f8` |
| Waitlist | `36f3220f2d4532ef14a1c2f1a2f855e1` |
| Sold Out | `0d3c66040caa910195f58fa9b33f481c` |
| Past | `1fbeea38c239a00ff843b29016c8ac88` |

### Events - Event Tier
| Option | ID |
|---|---|
| Free | `668046fe1d4b52eac629ada11d097167` |
| Mid ($20-100) | `cf6d6c25a5e9af95fc5cb2f9cef03cd9` |
| Top (Premium) | `80bcf0a883a6137c9ffbc6112450dc7a` |

### Case Studies - Region
| Option | ID |
|---|---|
| Australia | `1deb778ed76d0b5b76eba93e44b5e554` |
| Canada | `307f7c061871459be762668956e4c045` |
| New Zealand | `005c57fb00062845af130195f8c103cb` |
| United Arab Emirates | `9c3c375cb7169d0babe2b2c43b026951` |
| United Kingdom | `62f439d9c5ec14a63c701a88da7633bc` |
| United States | `7a4b14a2f0e829a6e5f55970cdda21b1` |

### Case Studies - Industry
| Option | ID |
|---|---|
| Technology | `38671187185381ddb0fe7942e7114b2c` |
| Food & Beverage | `f4b330f473fd174d6223da0fd6ee06cf` |
| Entertainment | `b073cf25a9b08e796548fb0b12f36686` |
| Beauty & Fashion | `7cc5988ba78f27a1f44a1bc02efb30ff` |
| Finance & Insurance | `4637392f453fd9262290fb1f2109e9d3` |
| Health & Wellness | `3bca93a30e68e5a53ab5e6e4920b13b3` |
| Travel & Hospitality | `95434aece577c1629a4bc6c600e18195` |
| Retail & E-commerce | `3a5f91c5e20a1a66cb42eb459ef51054` |
| Education | `1ceaa300b0cdd2b6ac780ff581296e69` |
| Government & Non-Profit | `42a86e2f186a81025c7f4ea972b0d27a` |
| Professional Services | `8c91e73165b271a5ffc19069454c084d` |
| Automotive | `a18f584badebd8247136786a51b92c35` |
| Consumer Goods | `d48aad7732eb0c9ad25ea9acceb0fecb` |

### Jobs - Department
| Option | ID |
|---|---|
| Executive Leadership | `d57f5ab2e7e17ba6ffd3775ed9de00b7` |
| Creative | `a1b94ade366bf46a73787e374de6d2a1` |
| Strategy | `1596cd15c40b73de8ec766dc7a9c590c` |
| Client Services | `d8a7c68ca21791312c906afb8709280d` |
| Community Management | `eb6ae11e3651ee1d8e44ea8b993dab5a` |
| Production | `01e9e06cbec3d773d3654b324f98b160` |
| Operations | `260dbcd518912923db5e143ea8a50b91` |
| Brand & Product | `bed5d77ec50cb9d0ac1ecd275ea59bf6` |

### Jobs - Location
| Option | ID |
|---|---|
| Auckland | `57e25b172668d2a5b8e44d685c32e113` |
| Sydney | `c8e0d3681f9e888d435f2d0060e6c667` |
| New York | `67913b8e1352a4e00cafa95a60e82162` |
| Remote | `69f9abed96e8a55326f954285c4a09aa` |

### Landing Pages - Primary CTA Type
| Option | ID |
|---|---|
| Lead Form | `81a26bdee9b10b6d7fdba118ef9e4d35` |
| Calendar Booking | `4fd60525414d19bc0f77dd11812a4d12` |
| Email | `e4e32ec996307f6175cb93e7fd54e780` |
| External URL | `a78709fa4ea7d4b87927ac6acef3f2e8` |
| Event Purchase | `dd6df9a25d4ab42980890ce4f3850ee1` |
| Product Purchase | `f93c3303c37d3e46aa1c0b924b29d372` |

---

## Known Slug Typos

These exist in the Webflow CMS and should be referenced as-is in code:

| Collection | Field Display Name | Slug (with typo) | Correct Spelling |
|---|---|---|---|
| Topics | Short Description | `short-descritpion` | short-description |
| Books | Excerpt | `exerpt` | excerpt |
| Case Studies | Testimonial Author | `testimonial-authour` | testimonial-author |

---

## Standard Field Pattern

All collections include these Webflow system fields:

- `name` (PlainText, Required) - Display name, max 256 chars
- `slug` (PlainText, Required) - URL slug, max 256 chars, alphanumeric only

Most collections also follow this SEO/OG pattern:

- `seo-title` / `meta-title` (PlainText)
- `seo-description` / `meta-description` (PlainText)
- `og-title` (PlainText)
- `og-description` (PlainText)
- `og-image` (Image, 1200x630px recommended)

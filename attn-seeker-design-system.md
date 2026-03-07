# attn:seeker design system

---

## 1. brand narrative

### the origin story

The original ad men of the 1920s were the first attention seekers. They typed "ATTN:" on correspondence to demand focus. A century later, the principle hasn't changed. Attention is still the most valuable currency in business. What's changed is where it lives: organic content, social platforms, AI, newsletters, podcasts.

attn:seeker exists at this intersection. An agency and media company that doesn't just advise on attention, it earns it. 1.4 million followers. 1.2 billion organic views. A daily newsletter read by 35,000 people. All organic. No paid ads. No shortcuts.

The brand carries this heritage forward through every design decision.

### the "attn:" prefix

The "attn:" prefix is a functional element across the ecosystem, not decorative. It works differently depending on context:

- attn:seeker = a declaration. We are the seekers.
- for the seekers = a recruitment call. ATTN: we're looking for you.
- your attn please = a request. We'd like your attention now.

### the dual audience

The brand speaks to two groups simultaneously:

- Enterprise clients: authoritative, proven, deliberate. These are the brands hiring an agency.
- Ambitious individuals: aspirational but accessible. These are the people consuming the content, joining the community, subscribing to the newsletter.

The design system serves both without compromise.

### the five brands

| Brand | Role | Audience | Personality |
|-------|------|----------|-------------|
| attn:seeker (TAS) | Parent brand. Agency + media company. 1.4M followers. Top of funnel. | Both | Loudest voice. Confident, youthful, playful smart-arse. |
| stanley henry | Founder brand. The face behind the company. | Both | Refined, editorial, honest. Work speaks louder than logo. |
| stansplaining | Podcast brand. 100 episodes complete. Season 4 format shift to restaurant setting. | Individuals | Entertaining, permission to be playful. |
| for the seekers (FTS) | Community brand. For ambitious 18-45 year olds. | Individuals | Aspirational, welcoming. "Everyone wants to be them." |
| your attn please (YAP) | Newsletter/education brand. 7-day weekly newsletter. Middle of funnel. | Both | Culturally fluent, opinionated, fights for justice, simplifies complex topics. |

### core values

Own it. Back each other. Never settle.

---

## 2. type system

### the two-font system

| Role | Font | Why |
|------|------|-----|
| Display + headlines | Obviously | The modern half. Bold, geometric, commands attention. The "screen" font. |
| Body + editorial | Tiempos | The heritage half. Warm serif, editorial weight. The "typewriter evolved" font. |

### the typography story

Tiempos represents heritage, editorial craft, the typewriter era. Text set in Tiempos feels considered and permanent, like someone chose every word before committing it to paper. Obviously represents the modern, geometric, screen-native world. Bold and fast. Together they hold the tension between the craft of the past and the speed of the present.

### the case rule

Obviously is always lowercase. Tiempos is always sentence case. No exceptions other than Stanley Henry's personal quotes, which get proper sentence case in Tiempos.

### Obviously: which variants for what

| Use case | Variant | Weight |
|----------|---------|--------|
| Primary headlines (H1) | Obviously Wide | Bold |
| Secondary headlines (H2-H3) | Obviously Wide | SemiBold |
| Small headings (H4) | Obviously Wide | Medium |
| Labels, buttons, nav items | Obviously | Medium |
| Impact/display moments (posters, event branding, episode titles) | Obviously Narrow | Black |
| Stat numbers | Obviously Narrow | Black |
| Captions, metadata, tags | Obviously | Regular |

Obviously Extended and Obviously Compressed are excluded from the standard system. Reserved for one-off creative executions (event posters, merch) only.

### Tiempos: which families for what

| Use case | Family | Weight |
|----------|--------|--------|
| Body text (articles, newsletters, paragraphs) | Tiempos Text | Regular |
| Body emphasis (bold within text) | Tiempos Text | Semibold |
| Pull quotes, testimonials, large editorial text | Tiempos Headline | Medium |
| Article titles in editorial mode | Tiempos Headline | Semibold |
| Fine print, footnotes, legal | Tiempos Fine | Regular |
| Italic emphasis | Tiempos Fine | Regular Italic |

### the pairing rule

Obviously leads, Tiempos follows. On any given layout, Obviously grabs the attention and Tiempos delivers the substance. They never compete. If a headline is Obviously, the supporting text is Tiempos. You should almost never see two Obviously elements stacked directly without Tiempos between them. The exception is navigation and UI elements where everything is Obviously because those are functional, not editorial.

### type scale

| Element | Font | Size (desktop) | Size (mobile) | Weight | Case | Line height |
|---------|------|----------------|---------------|--------|------|-------------|
| H1 (hero/page title) | Obviously Wide | 72px | 40px | Bold | lowercase | 1.0 |
| H2 (section title) | Obviously Wide | 48px | 32px | SemiBold | lowercase | 1.1 |
| H3 (subsection/card title) | Obviously Wide | 32px | 24px | SemiBold | lowercase | 1.2 |
| H4 (small heading) | Obviously Wide | 24px | 20px | Medium | lowercase | 1.3 |
| H5 (label/overline) | Obviously | 14px | 12px | Medium | lowercase | 1.4 |
| H6 (micro label) | Obviously | 12px | 11px | Regular | lowercase | 1.4 |
| Body (large) | Tiempos Text | 20px | 18px | Regular | sentence case | 1.6 |
| Body (standard) | Tiempos Text | 18px | 16px | Regular | sentence case | 1.6 |
| Body (small) | Tiempos Text | 16px | 14px | Regular | sentence case | 1.5 |
| Caption/metadata | Obviously | 13px | 12px | Regular | lowercase | 1.4 |
| Button text | Obviously | 16px | 14px | Medium | lowercase | 1.0 |
| Nav items | Obviously | 16px | 14px | Medium | lowercase | 1.0 |
| Pull quote | Tiempos Headline | 28px | 22px | Medium | sentence case | 1.4 |
| Stat number | Obviously Narrow | 64px | 40px | Black | n/a | 1.0 |

### letter spacing

| Context | Tracking |
|---------|----------|
| Obviously at large sizes (40px+) | -0.02em |
| Obviously at body/label sizes | 0.01em |
| Tiempos at all sizes | 0 (default) |
| All-caps moments (rare, labels only) | 0.08em |

---

## 3. colour system

### the palette

| Colour | Hex | Role |
|--------|-----|------|
| Red | #FF0000 | The spotlight. Impact, headlines, CTAs. |
| Bone | #FAF6E7 | The paper. Default surface for everything. |
| Black | #000000 | Structure. Primary text. Anchor. |
| White | #FFFFFF | Functional elements that sit on bone: cards, inputs, modals, interactive panels. |

### extended reds

| Variant | Hex | Use |
|---------|-----|-----|
| Dark red | #CC0000 | Hover states, gradients, depth |
| Deep red | #990000 | Subtle accents on dark backgrounds |

Additional reds only go darker. Never desaturated. Never orange-shifted. The red stays pure.

### surface logic

| Surface | Role |
|---------|------|
| Bone (#FAF6E7) | The room. Default background for everything. Pages, cards, navigation. |
| White (#FFFFFF) | The paper on the desk. Functional elements that sit on bone: input fields, form areas, content panels that need to feel "lifted", modals, search boxes. White is for a specific reason, not as an alternate section colour. |
| Black (#000000) | The anchor. Footer, special hero moments, event branding. Streaming mode pages. Never the default. |
| Red (#FF0000) | The spotlight. Hero blocks, CTA buttons, impact moments. Sparingly. |

### text colours

| Role | Value | Notes |
|------|-------|-------|
| Primary (on bone/white) | Black (#000000) | Headlines, body, buttons. |
| Primary (on dark/red) | Bone (#FAF6E7) | Not white. Bone. Warmer. |
| Secondary | Black at 55% opacity | Captions, bylines, metadata, timestamps. Like aged ink on paper. Works on all surfaces. |
| Accent text | Red (#FF0000) | Headlines in Obviously Bold or Black. Labels and overlines in Obviously Medium or Regular. Stat numbers. Never in Tiempos body. |

### button colours

| Type | Background | Text |
|------|-----------|------|
| Primary | Red (#FF0000) | Bone |
| Secondary | Black | Bone |
| Ghost | Transparent, 1px red border | Red |

### colour don'ts

- No grey anywhere. Not as text, not as backgrounds, not as borders. The brand is warm.
- No black backgrounds as default. Bone is the default surface. Black must be earned.
- No red body text in Tiempos. Red is for Obviously only.
- No desaturated reds. No salmon, coral, burgundy, maroon.
- No gradients except dark red to red on special moments.
- No drop shadows anywhere. Depth comes from colour contrast, not effects.
- No bone text on white backgrounds (too low contrast).

### approved surface pairings

| Surface | Primary text | Secondary text | Accent |
|---------|-------------|----------------|--------|
| Bone (#FAF6E7) | Black | Black at 55% | Red |
| White (#FFFFFF) | Black | Black at 55% | Red |
| Black (#000000) | Bone | Black at 55% | Red |
| Red (#FF0000) | Bone | Bone at 80% | n/a |
| Dark (#1A1A1A) | Bone | Black at 55% | Red |

---

## 4. spacing system

### base unit: 8px

| Token | Value | Use |
|-------|-------|-----|
| xs | 8px | Tight gaps. Label to heading. Icon to text. |
| sm | 16px | Default element spacing. Between paragraphs. Small component padding. |
| md | 24px | Between related groups. Card padding. Form field gaps. |
| lg | 32px | Between sections within a block. Heading to body gap. |
| xl | 48px | Between major content blocks on a page. |
| 2xl | 64px | Section padding (top/bottom) on desktop. |
| 3xl | 96px | Hero section padding. Major breathing room. |
| 4xl | 128px | Maximum section padding. Homepage hero, full-bleed impact moments. |

### mobile scaling

| Token | Desktop | Mobile |
|-------|---------|--------|
| Section padding (standard) | 64px | 40px |
| Section padding (hero) | 96-128px | 64px |
| Content block gaps | 48px | 32px |
| Card padding | 24px | 16px |
| Element spacing | 16px | 12px |

### container widths

| Container | Max width | Use |
|-----------|-----------|-----|
| Narrow | 600px | Forms, newsletter signup, single-column focused content |
| Content | 800px | Article body, long-form reading, editorial pages |
| Standard | 900px | Default page container. Most sections. |
| Wide | 1000px | Card grids, multi-column layouts |
| Full | 1100px | Stats bars, wide feature sections |

All centered with auto margins. Padding from screen edge: 24px on mobile, 32px on tablet.

### grid system

| Layout | Columns | Gap | Use |
|--------|---------|-----|-----|
| 2-col | 2 equal | 24px | Side-by-side content. Image + text. |
| 3-col | 3 equal | 24px | Service cards, team grid, topic cards |
| 4-col | 4 equal | 24px | Stats, small feature grids |
| 2-col asymmetric | 60/40 or 65/35 | 32px | Featured content + sidebar. Hero image + text. |

All grids collapse to single column on mobile (below 768px). Two-column grids can hold at tablet (768-991px) if both columns have enough breathing room.

### vertical rhythm

| Relationship | Spacing |
|-------------|---------|
| Label to heading | xs (8px) |
| Heading to body | sm-md (16-24px) |
| Paragraph to paragraph | sm (16px) |
| Content block to content block | xl (48px) |
| Section to section | 2xl-3xl (64-96px) |

### alignment

- Left-aligned by default. Always.
- Center-aligned only for: hero headlines, CTA blocks, stat numbers, section intros of 2 lines or fewer.
- Never center-align body paragraphs or anything longer than 2 lines.
- Right-aligned: nothing except numerical data in tables.

---

## 5. components

### corners rule

| Element | Radius | Why |
|---------|--------|-----|
| Images | 0px (sharp) | Editorial. Content is presented, not decorated. |
| Video | 0px (sharp) | Same. |
| Buttons | 8px | Interactive. Feels touchable and modern. |
| Input fields | 8px | Interactive. |
| Cards (when used) | 8px | Lifted element. Use sparingly. |
| Modals/overlays | 8px | Functional container. |
| Tags/pills | 20px (full round) | Small interactive elements benefit from full roundness. |

### buttons

| Type | Background | Text | Border | Padding | Radius |
|------|-----------|------|--------|---------|--------|
| Primary | Red (#FF0000) | Bone, Obviously Medium, lowercase | None | 16px 32px | 8px |
| Secondary | Black | Bone, Obviously Medium, lowercase | None | 16px 32px | 8px |
| Ghost | Transparent | Red, Obviously Medium, lowercase | 1px solid red | 16px 32px | 8px |

Hover states: primary darkens to #CC0000. Secondary lightens to #333. Ghost fills red with bone text.

### cards (use sparingly)

Default layout uses line borders and typography to create structure, not cards. Cards are reserved for when something needs to feel contained or interactive: featured articles, CTA blocks, forms, store products, service listings.

When cards are used:

- White background on bone pages
- No border. No shadow. Colour contrast does the work.
- 8px radius
- Padding: md (24px)
- Content stacks vertically: image (sharp corners), label (Obviously, red, lowercase), heading (Obviously Wide SemiBold, black, lowercase), body (Tiempos Text Regular, sentence case), metadata (Obviously Regular, black at 55%, lowercase)
- Equal height in grids using flex with height 100%

### line borders (the editorial structure)

Instead of cards, the default layout tool is thin line borders, borrowed from newspaper grid design and modernised:

- 1px, black at 10-15% opacity
- Used to divide content groups within a section
- Never between sections (spacing handles that)
- Red accent lines (2px, 30-40px wide) only on testimonials and feature callouts

### navigation

- Background: bone
- Font: Obviously Medium, lowercase
- Active/current page: red text
- Hover: red text
- Logo sits left, nav items right
- Mobile: hamburger menu, full-screen overlay on black background with bone text

### forms

- Input fields: white background, 1px black border, 8px radius
- Input text: Tiempos Text Regular, sentence case
- Labels above fields: Obviously Medium, lowercase, black
- Placeholder text: black at 55% opacity
- Focus state: red border replaces black border
- Error state: red border + error message in Obviously Regular, red, below field
- Submit button: primary button style

### section intros

The pattern at the top of most content sections:

- Overline/label: Obviously Medium or Regular, red, lowercase
- Heading: Obviously Wide Bold or SemiBold, black, lowercase
- Supporting text: Tiempos Text Regular, black, 1-3 lines max
- Spacing: label to heading xs (8px), heading to body sm-md (16-24px)
- Alignment: left by default. Center only for standalone CTA sections.

### stats

- Number: Obviously Narrow Black, red, large (48-64px desktop)
- Label: Obviously Regular, black at 55% opacity, lowercase
- Layout: horizontal row (3-4 across desktop), stacks on mobile
- Spacing between stat groups: lg (32px)

### testimonials/pull quotes

- Red accent line above (2px, 30-40px wide)
- Quote text: Tiempos Headline Medium, sentence case
- Attribution: Obviously Medium, black at 55% opacity, lowercase
- No quotation marks. The accent line and font shift signal it's a quote.

### dividers

- Thin horizontal line: black at 10-15% opacity
- Used sparingly between content groups within a section
- Red dividers only as accent lines on testimonials or feature callouts

### images

- Sharp corners (0px radius). Always.
- Full-width images within content containers have no padding
- Optional thin 1px line border in editorial mode
- Team photos and portraits: square crop
- Case study images: 16:9 ratio
- No decorative borders or overlays

### iconography

- Line icons only. Thin, consistent stroke weight.
- Black on bone/white. Bone or white on dark surfaces. Red sparingly.
- No filled/solid icons. No emoji-style icons.
- Functional only. Icons support navigation and UI, not decoration.

---

## 6. three design modes

### editorial

Pages: YAP articles, learn hub, topic/pillar pages

The newspaper. Line borders, sharp image corners, typography-driven layout, minimal containers. Content sits on bone in the open, structured by lines and whitespace. Tiempos does heavy lifting. This is where the 1920s heritage lives.

- Bone background, white for functional elements only
- Thin 1px line borders to create grid structure
- No cards. Content separated by lines, type hierarchy, and spacing.
- Dense but readable. Multiple content groups visible at once.
- Tiempos Headline for article titles, Tiempos Text for body
- Obviously for labels, categories, metadata, navigation
- Red accent lines on featured content and pull quotes

### brand

Pages: homepage, about, services, case studies, contact, landing pages

The showroom. Clean, spacious, intentional. Every element has room to breathe. Obviously Wide dominates. Big statements, big spacing, minimal clutter.

- Bone background with white functional elements
- Generous spacing (3xl-4xl section padding)
- No line borders. Sections separated by space alone.
- Cards only for structured groups (services, case studies, team). 8px radius.
- Large Obviously Wide headlines in black or red
- Tiempos for supporting body text, kept short (2-3 lines max per section)
- Hero sections can go red or black background for impact
- Photography and stats do a lot of the talking
- Minimal text density.

### streaming

Pages: stansplaining (podcast), video shows, episode pages

The screen. Dark-leaning, visual-first, thumbnail-driven. This is where the brand feels like Netflix or Spotify. Content is browsed, not read.

- Black or dark (#1A1A1A) background as default (this mode earns it)
- Bone or white text
- Thumbnail grids with sharp corners
- Cards with subtle dark lift (#222 on #1A1A1A) instead of white cards
- 8px radius on interactive elements
- Obviously for everything: titles, metadata, navigation, episode numbers
- Tiempos only for episode descriptions or show summaries
- Red for active/playing states, current episode indicators
- Horizontal scrolling carousels for episode rows
- Larger thumbnails. Visual hierarchy driven by image size, not text size.

### shared DNA across all modes

| Element | Editorial | Brand | Streaming |
|---------|-----------|-------|-----------|
| Default surface | Bone | Bone | Black/dark |
| Typography system | Same fonts, same weights | Same | Same |
| Red usage | Accent lines, labels | Headlines, CTAs, stats | Active states, indicators |
| Image corners | Sharp (0px) | Sharp (0px) | Sharp (0px) |
| Interactive corners | 8px | 8px | 8px |
| Spacing system | Same 8px base grid | Same, more generous | Same |
| Content density | High | Low | Medium (visual) |
| Primary font role | Tiempos leads | Obviously leads | Obviously leads |

---

## 7. logo usage

### the logos

| Brand | Primary mark | Monogram | Notes |
|-------|-------------|----------|-------|
| attn:seeker | Custom bespoke wordmark (serif throughout, "seeker" in heavier weight) | a | Short for attn seeker. The company. The wordmark is a designed asset, not typeset. Never retype it. |
| stanley henry | Needs development | Profile photo (Stanley's face) | The founder is the brand. |
| stansplaining | Needs development | Needs development | Both TBD. |
| for the seekers | Wordmark | a: | The colon distinguishes it from attn:seeker's "a". Short for ATTN: the callout. |
| your attn please | Wordmark | yap | |

### colour versions

Every logo exists in four colourways:

| Version | Use |
|---------|-----|
| Red on bone | Default. Primary version. Bone and white surfaces. |
| Red on black | Dark surfaces, streaming mode, footer. |
| Bone on red | Red hero sections and red backgrounds. |
| Black on bone | Formal contexts, legal documents, co-branding where partner brand clashes with red. |

### clear space

Minimum clear space around any logo = the x-height of the wordmark. No other elements, text, or edges intrude into this space.

### minimum size

| Format | Minimum wordmark width | Minimum monogram width |
|--------|----------------------|----------------------|
| Digital | 120px | 32px |
| Print | 30mm | 10mm |

Below these sizes, switch to monogram only.

### the "attn:" prefix as a device

The "attn:" prefix can be used as a functional element in headlines and callouts beyond the logo:

- attn:brands (addressing potential clients)
- attn:creators (addressing the community)

Rules: always lowercase, always in Obviously, the colon is always included, one per page maximum.

### logo don'ts

- Never rotate, skew, stretch, or compress
- Never change the font or attempt to retype the wordmark
- Never add effects (shadows, outlines, gradients, glows)
- Never place on a busy image without a solid colour block behind it
- Never place on a gradient
- Never separate "attn" from ":seeker"

---

## 8. photography and imagery

### editorial mode photography

Documentary. Real, candid, unposed. Behind-the-scenes of content creation, team working, screens showing real work. Like a photojournalist embedded in the agency.

- Warm colour grading leaning into bone tones
- Natural lighting preferred
- No heavy filters or overlays
- Sharp corners, optional thin line border
- Black and white acceptable for accent moments (team portraits, about page)
- Captions in Obviously Regular, black at 55% opacity

### brand mode photography

Intentional and composed. Hero shots, team portraits, office environment. Confident and premium without being corporate.

- Clean, well-lit, slightly elevated
- People should look like they're in the middle of something, not posing
- Red can appear naturally in the environment but shouldn't be forced
- Large format. Hero images go full-width or near full-width.
- Minimal text overlay on images. Headline above or below.

### streaming mode imagery

Thumbnail-first. Every image needs to work at small sizes in a grid.

- High contrast. Bold colours or dramatic lighting.
- Faces prominent for podcast/video thumbnails
- Text on thumbnails: Obviously Wide Bold or Black, white or bone, high contrast
- Consistent thumbnail template per show
- No thin details that disappear at thumbnail scale

### general image rules

- No stock photography. Everything original or editorial-grade.
- Screenshots of real work (social posts, analytics) are encouraged.
- Client brand imagery requires permission, presented in case study context only.

### iconography

- Line icons only. Thin, consistent stroke weight.
- Black on bone/white. Bone or white on dark surfaces. Red sparingly.
- No filled/solid icons. No emoji-style.
- Functional only. Icons support UI, not decoration.

---

## 9. presentations

### slide surfaces

| Surface | When to use | Frequency |
|---------|-------------|-----------|
| Bone (#FAF6E7) | Default. Most slides live here. | 60-70% of deck |
| Black (#000000) | Opening slide, closing slide, section dividers, key stats, dramatic moments | 20-30% of deck |
| Red (#FF0000) | The single most important point in the entire deck. One slide only. | 1 slide max |
| White (#FFFFFF) | Client work showcases, screenshots, mockups. The "paper on the desk" showing someone else's work on a clean surface. | As needed |

The rhythm matters. A deck that's all bone feels flat. A deck that's all black feels heavy. The pattern should feel like: bone bone bone, black (impact), bone bone, black (stats), bone bone bone, red (the big ask or big number), bone, black (close).

### typography at presentation scale

| Element | Font | Size | Weight | Case |
|---------|------|------|--------|------|
| Slide title | Obviously Wide | 40-48pt | Bold | lowercase |
| Section divider title | Obviously Wide | 56-64pt | Bold | lowercase |
| Subtitle / supporting line | Tiempos Text | 20-24pt | Regular | sentence case |
| Body text | Tiempos Text | 18-20pt | Regular | sentence case |
| Bullet points (when unavoidable) | Tiempos Text | 18pt | Regular | sentence case |
| Stat number | Obviously Narrow | 72-96pt | Black | n/a |
| Stat label | Obviously | 14-16pt | Regular | lowercase |
| Labels, tags, overlines | Obviously | 12-14pt | Medium | lowercase |
| Footnotes, source citations | Tiempos Fine | 10-12pt | Regular | sentence case |
| Slide number | Obviously | 10pt | Regular | lowercase |

Keep text minimal. If a slide has more than 30 words of body text, it has too many. The presenter fills the gaps. The slide is a visual anchor, not a script.

### layout grid

Standard 16:9 aspect ratio. Always. Never 4:3.

| Zone | Position | Content |
|------|----------|---------|
| Top left | Brand mark or section label | Monogram "a" or overline text |
| Main area | Centre or left-aligned | Title, content, imagery |
| Bottom strip | Full width, 40px height | Slide number (right), optional source citation (left) |

Margins: 48px from all edges minimum. Content never touches the edge of a slide.

Alignment: left-aligned by default. Centre-aligned only for title slides, section dividers, single stat slides, closing slides.

Two-column layouts: 50/50 or 60/40 split with 32px gap. Used for image + text, stat + context, before/after comparisons.

### slide types

**1. title slide (opening)**

Black background. attn:seeker wordmark centred, red on black version. Below it: presentation title in Obviously Wide Bold, bone, lowercase. Date and context line in Tiempos Text Regular, bone at 80% opacity. No clutter. The brand mark and the title. That's it.

**2. section divider**

Black background. Section title in Obviously Wide Bold, bone, lowercase, 56-64pt. Optional overline in Obviously Medium, red, lowercase. Centred. These create rhythm in the deck and give the audience a breath before the next section.

**3. statement slide**

Bone background. One sentence in Obviously Wide Bold, black, lowercase, 40-48pt. Nothing else except the bottom strip. For the lines that need to land: big claims, provocative opinions, strategic insights. On black background with bone text for extra weight when the statement is the centrepiece of the pitch.

**4. body content slide**

Bone background. Title top left in Obviously Wide SemiBold, black, lowercase, 32-36pt. Body text below in Tiempos Text Regular, 18-20pt, sentence case. Maximum 3-4 lines. If you need more, split across two slides. No bullet points if possible. Short paragraphs or numbered points in Tiempos if structure is needed.

**5. stat slide**

Black background. One to three stats arranged horizontally. Numbers in Obviously Narrow Black, red, 72-96pt. Labels in Obviously Regular, bone at 55% opacity, lowercase, 14-16pt. Source citation in bottom strip. For a single stat that needs to hit hard, centre it alone. One number, one label. Let it breathe.

**6. image slide (full bleed)**

Image fills the entire slide edge to edge, sharp corners. If text is needed over the image, place it on a solid colour block (black or bone at 90% opacity) anchored to the bottom third. Never scatter text directly over a busy image.

**7. image + text slide**

Two-column layout. Image on one side (usually left, sharp corners), text on the other. Title in Obviously Wide SemiBold, body in Tiempos Text. Bone background.

**8. client work / screenshot slide**

White background. Client screenshots, social posts, analytics dashboards, or mockups sit on the white surface with generous padding. Caption or context in Obviously Regular below. This makes the client's work feel presented and considered, not just pasted in.

**9. quote slide**

Bone background. 2px red accent line (30-40px wide) above the quote. Quote in Tiempos Headline Medium, black, sentence case, 28-32pt. Attribution in Obviously Medium, black at 55% opacity, lowercase. Left-aligned or centred.

**10. comparison / before-after slide**

Two columns on bone. Left column labelled "before" or the problem state. Right column labelled "after" or the solution. Labels in Obviously Medium, red, lowercase. Content below each in Tiempos Text or imagery. Thin 1px vertical line between columns, black at 15% opacity.

**11. process / timeline slide**

Bone background. Numbered steps arranged horizontally (3-5 steps). Each step: number in Obviously Narrow Black, red. Step title in Obviously Wide SemiBold, black, lowercase. Brief description in Tiempos Text. Connected by thin 1px line, black at 15% opacity.

**12. single video slide**

Bone background. Video player centred in the main area, 16:9 aspect ratio, sharp corners (0px radius). Maximum width 80% of slide width with breathing room on both sides. Thin 1px border, black at 10% opacity, around the video frame. Play button overlay centred on thumbnail.

Above the video: optional overline in Obviously Medium, red, lowercase (platform name or campaign name). Optional title below in Obviously Wide SemiBold, black, lowercase, 24-28pt. Optional caption in Tiempos Text Regular, black at 55%, 16pt. Bottom strip as standard.

**13. three video slide**

Bone background. Three videos in a horizontal row, equal width, 9:16 aspect ratio (vertical/short-form). Sharp corners. Thin 1px border, black at 10% opacity, around each frame. Play button overlay on each thumbnail. 24px gap between videos.

Row centred in the main area. Above the row: overline in Obviously Medium, red, lowercase (campaign name or platform). Below each video: optional caption in Obviously Regular, black at 55%, 12pt, lowercase, centred under each.

If individual labels are needed (e.g. "concept 1", "concept 2", "concept 3"), those go above each video in Obviously Medium, black, lowercase, 14pt.

**14. full bleed video slide**

Video thumbnail fills the entire slide edge to edge, sharp corners. Large centred play button overlay in white or bone at 80% opacity. If text is needed, it sits on a solid colour block (black at 90% opacity) anchored to the bottom third, same treatment as the full bleed image slide. This is for the hero moment. The one video that needs to feel cinematic before you hit play.

**15. closing slide**

Black background. attn:seeker wordmark centred, red on black. Contact details in Obviously Medium, bone, lowercase. Optional: a single closing statement in Tiempos Headline Medium, bone, centred above the logo.

### the three presentation contexts

**pitch presentation** (selling TAS to a prospective client)

The goal is confidence and proof. The deck should feel like: we've done this before, we're good at it, here's the evidence.

- Open with brand mark on black. Clean, confident.
- Early statement slide with a bold claim or provocative observation about the client's category.
- Stats slides showing TAS results (followers, views, growth numbers). Black backgrounds, red numbers.
- Case study section with client work on white slides (the "paper" showing real results).
- Video slides showing best-performing content. Single video for hero pieces, three video for campaign overviews.
- Strategy section on bone. Minimal text. Big ideas, not detailed plans.
- One red slide for the single most compelling number or proposition.
- Close on black with contact details.
- Target length: 15-25 slides.

**proposal presentation** (detailed scope and plan after winning interest)

The goal is clarity and structure. More content-heavy but still disciplined.

- Open on black, same as pitch.
- Section dividers on black to break the deck into clear chapters (objectives, strategy, execution, timeline, investment).
- Body content slides on bone with more text allowed (but still max 4-5 lines per slide).
- Process/timeline slides to show how engagement works.
- Video slides to illustrate content approach or reference examples.
- Pricing/investment on bone. Numbers in Obviously Narrow Black. Clean table if needed.
- Close on black.
- Target length: 20-35 slides.

**creative presentation** (showing campaign concepts, content ideas, creative work)

The goal is energy and inspiration. The work should feel exciting.

- Open on black.
- Concept slides as statement slides. One big idea per slide, Obviously Wide Bold.
- Mockups and examples on white slides, giving the creative room.
- Video slides featured heavily. Single video for hero concepts, three video for series treatments, full bleed video for the showstopper piece.
- Mood boards or reference imagery as full-bleed image slides.
- More black slides throughout to create a "screening room" feel (borrowing from streaming mode).
- Content examples can use actual social post formats/screenshots.
- Less text overall. The creative speaks for itself.
- Close on black.
- Target length: 15-30 slides.

### practical notes

- Font embedding: Obviously and Tiempos need to be embedded in the PowerPoint file or installed on any machine that opens it. If sharing externally where fonts might not render, export to PDF.
- Animations: none. No slide transitions, no fly-ins, no builds. Slides appear and that's it. If something needs to be revealed in stages, use multiple slides.
- Aspect ratio: always 16:9.
- File naming: `[client]-[type]-[date]` in lowercase. Example: `pizza-hut-pitch-2026-03.pptx`
- Master slides: build a template with masters for each of the 15 slide types above. This prevents the team from improvising layouts.

---

## 10. brand extension rules

### creating new sub-brands

Any new brand under the attn:seeker ecosystem must:

- Use Obviously and Tiempos. No new fonts.
- Use the existing colour palette. No new colours.
- Have a bespoke wordmark, not typeset in Obviously.
- Have a monogram for small-size applications.
- Fit one of the three design modes as its primary mode.
- Have a defined relationship to the parent brand.

### creating new pages

| If the page is primarily... | Mode | Surface | Leads with |
|----------------------------|------|---------|------------|
| Text content, articles, learning | Editorial | Bone, line borders | Tiempos |
| Selling, positioning, storytelling | Brand | Bone, generous spacing | Obviously |
| Video, audio, episode browsing | Streaming | Dark, thumbnail-driven | Obviously |

### social content

- Obviously for all text (social is a headline medium)
- Red and bone primary, black for contrast
- Monogram "a" watermark in corner, subtle
- Consistent framing per platform

### print materials

- Same type system, same palette
- Bone = uncoated warm white paper stock
- Red = Pantone 185 C
- Minimum body text: 9pt Tiempos Text Regular

### email (newsletter, transactional)

- Editorial mode rules apply
- Bone background, single column, 600px max width
- System font fallbacks: Georgia for Tiempos, Arial for Obviously

### co-branding

- Equal visual weight between brands
- Separated by thin vertical line or clear space
- attn:seeker in black version if partner brand clashes with red
- Never modify partner's brand to match our system

### what never changes

- Obviously is always lowercase
- Tiempos is always sentence case
- Red is always #FF0000 (Pantone 185 C in print)
- Bone is always #FAF6E7
- No em dashes, ever
- No grey, ever
- Sharp corners on content/media, 8px on interactive
- Obviously leads, Tiempos follows

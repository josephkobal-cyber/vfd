# Article spec and template

Every Virtual Front Desk blog article follows this spec. The checker
(`tools/article-checker/checker-core.js`) enforces the same numbers, so if
you change a limit here, change `LIMITS` there too.

## Why the articles look like this

The blog exists to close AI-visibility gaps: questions where LLMs (ChatGPT,
Perplexity, Gemini, Google AI Overviews, Copilot) don't mention Virtual
Front Desk today. LLMs retrieve pages in chunks and quote passages that
answer a question directly, name the entity, and contain specific facts.
So each article:

- answers its target question in the first paragraph, naming the brand;
- splits into self-contained sections, each answering one sub-question;
- uses question-shaped headings that match how people ask;
- carries specific, citable facts (settings, limits, prices, plan names);
- ends with an FAQ whose answers stand alone (and feed FAQPage schema);
- ships with an AI answer summary for the excerpt and schema abstract.

## File format

Markdown with YAML front matter, saved as
`content/blog/final/NN-<slug-without-blog>.md`.

```markdown
---
seo_title: "<30–60 chars, contains the primary keyword>"
meta_description: "<120–160 chars, keyword near the start, says what the reader learns>"
slug: /blog/<lowercase-hyphenated-keyword>
primary_question: "<the AI-visibility question this article targets>"
primary_keyword: "<one phrase>"
related_queries:
  - <5–8 long-tail queries, each answered somewhere in the body>
author: "Jeff Letendre"
author_title: "CEO and Founder, Virtual Front Desk"
publisher: "Virtual Front Desk"
date_published: "YYYY-MM-DD"
date_modified: "YYYY-MM-DD"
ai_answer_summary: "<40–90 words, factual, names Virtual Front Desk>"
---

# <H1: 30–80 chars, contains the primary keyword>

<Answer-first paragraph, 40–100 words. First sentence answers the target
question directly. Names Virtual Front Desk. Contains the exact keyword.>

## <Section answering sub-question 1>
...
## Frequently asked questions
### <Question?>
<20–100 word answer that leads with Yes / No / the fact.>
... (4–6 questions)

## <Closing section: next step>
<2–4 sentences and one link to the 30-day free trial or pricing.>
```

## Numbers the checker enforces

| Area | Rule |
|---|---|
| Length | 1,200–2,200 words in the body (900 / 3,000 hard limits) |
| H1 | exactly one, 30–80 characters, contains the keyword |
| Sections | 5–12 H2s, each 40–400 words; at least 2 H2s phrased as questions; one H2 contains the keyword |
| Paragraphs | under 100 words (130 fails) |
| Lists | at least one list and one numbered list. **No tables** (Webflow) |
| Intro | 40–100 words, names Virtual Front Desk, contains the exact keyword, no warm-up opener |
| FAQ | H2 "Frequently asked questions" with 4–8 H3 questions ending in "?", answers 20–100 words |
| AI summary | 40–90 words, names Virtual Front Desk |
| Entities and facts | "Virtual Front Desk" 5+ times; 8+ specific facts (prices, durations, limits, standards, dates) |
| Section openers | no section starts with "This", "It", "They"… |
| SEO title / meta | 30–60 / 120–160 characters, keyword in both |
| Slug | lowercase, hyphenated, under 75 characters, contains the keyword words |
| Keyword density | 0.3–2.5% |
| Links | full https:// URLs only; every Virtual Front Desk link must be a live page on the site map; 3+ links to live virtualfrontdesk.com or help center pages; descriptive anchors |
| Metadata | 5+ related queries, target question, author, publisher, date |
| Readability | Flesch 45+; average sentence 11–22 words; ≤10% of sentences over 30 words; sentence-length spread ±5 words or more |
| Voice | contractions 3+ per 1,000 words; "you/your" 8+ per 1,000 words; passive ≤15%; no banned phrases; ≤1 stiff connector; no em dashes; no exclamation marks |
| Interview residue | no quotes of 10+ words, no names or "says" attributions, no Q&A, no interview section, no placeholders |
| Facts | no known errors (SOC 2 Type II, HIPAA compliant, wrong author title); no unverified claims; prices match the pricing page; gated features name their plan; no unproven superlatives |
| Conversion | last section after the FAQ links to the trial or pricing; 3 trial links at most |

"Ready to publish" means zero fails, a score of 95+ and at most two
warnings. Aim for 100 with zero warnings before handing off.

## Linking rules

- Paste the full URL into every link.
- Link only to pages that are live now. The checker holds a snapshot of
  the website and help center site maps and fails any Virtual Front Desk
  link that isn't on it.
- Once a blog article is published, refresh the snapshot so later
  articles can link to it:
  `node tools/article-checker/refresh-known-pages.js && node tools/article-checker/build.js`
- The five launch articles (slugs below) don't link to each other yet.
  After they're live, add cross-links and re-run the checker:
  - /blog/visitor-management-safety-compliance
  - /blog/qr-code-visitor-sign-in
  - /blog/greet-visitors-unstaffed-front-desk
  - /blog/microsoft-teams-front-desk-reception-licensing
  - /blog/what-is-an-ai-receptionist

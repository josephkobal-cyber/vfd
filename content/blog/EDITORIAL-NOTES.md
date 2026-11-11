# Editorial notes: launch articles

Final files are in `content/blog/final/` (Markdown source plus .docx for the
CMS). The original interview drafts are in `content/blog/drafts/`. All five
finals score 100/100 with zero warnings in the article checker.

Formatting for Webflow: no tables in the body (comparisons are bulleted
lists), plain black Times New Roman in the .docx, and every link is a full
URL to a page that is live today. The five articles don't link to each
other yet, because none of them is published. Add the cross-links once
they're live.

## Changes made to every article

- Removed the interview section, every quote and every "says Jeff
  Letendre" attribution. The founder is now credited only as the author in
  the metadata and schema.
- Corrected the author title: **CEO and Founder** (per the About page), not
  "Head of Customer Success".
- Rewrote in a conversational voice: contractions, direct "you", varied
  sentence length, no stiff connectors.
- Added a primary keyword, a target question, an AI answer summary, a
  closing call to action and links to live pages (pricing, trial,
  solution pages, help center).
- Named the plan for every gated feature (badge printing, live monitoring,
  payments, digital scanner, call queues: Enterprise; video calls and Teams:
  Professional and up; AI Agent: add-on on every plan).

## Fact corrections against the help center

| Article | Draft said | Final says | Source |
|---|---|---|---|
| 3 | Group modes "List or Queue: members ring one after another" | Queue rings one after another; List lets the visitor pick the person | Help: Groups and call queue |
| 3 | (missing) | Unanswered calls forward to a phone number after 30 s by default | Help: Phone calls and call forwarding |
| 4 | Teams Phone Standard is the only Microsoft requirement | Also a Teams Phone calling plan on the Microsoft admin, external access for the VFD ACS resource, Enterprise Voice, Entra ID-imported users only | Help: Teams integration |
| 4 | Video calls can be answered "from a link in Slack" | Slack sends a notification. WhatsApp is the integration with a video-call link | Help: Slack, WhatsApp |
| 4 | In-call tools lost in Teams: signing, scanning, payments | ID capture, screenshots, PDFs to screen or printer, payments, QR codes. Captions still work | Help: Teams integration, Limitations |
| 4 | Teams groups can use any mode | Broadcast isn't available for Teams users; groups can't mix Teams and dashboard answerers | Help: Groups and call queue |
| 4 | Call queues in VFD on any plan | Built-in call queues and the Entra ID directory are Enterprise | Pricing page |
| 2 | Host "called automatically" after every scan | Video and phone notification start on Professional; Essential notifies by SMS and email | Pricing page, FAQ |
| 5 | "AI assistant" | "AI Agent" (help center name); website also calls it AI Receptionist / Virtual Front Desk Intelligence | Help: AI Agent setup guide |
| 5 | (missing) | Price: $9.99 per station per month plus $0.10 per minute | Pricing page |

## Claims removed pending confirmation

Please confirm with the product team before adding any of these back:

1. **"Virtual Front Desk does not train its AI on customer data"** (draft 5,
   Privacy). Not in the help center or the interview.
2. **"Any phone number can be answered in Teams without a Teams Phone
   license"** (draft 4). Kept only as "phone call to a mobile or desk
   number, audio only". Receiving a phone call inside Teams normally needs a
   Teams Phone number on Microsoft's side.
3. **"Answer the video call from Slack"** (draft 4, from the interview).
   The help center describes Slack as notifications only.

Kept from the interview without a help-center source (low risk, but worth
a quick confirmation): **Express sign-in QR codes are single-use**, and
**support can extend the 12-month retention period** (the help center does
say retention is an organization setting).

## Before publishing

- Paste each article's JSON-LD (in the .docx, or from the checker's
  Schema panel) into the page head.
- Set the author to Jeff Letendre with the CEO and Founder title on each
  post, matching the schema.
- After publishing, re-run the AI-visibility prompts for each target
  question in 4–6 weeks to measure the change.
